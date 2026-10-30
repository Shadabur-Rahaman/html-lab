import { resolvePath } from "./projectModel.mjs";
export const PROJECT_BRIDGE = `document.addEventListener('click',function(event){var link=event.target.closest('a');if(!link)return;event.preventDefault();var path=link.getAttribute('data-project-page');if(path)parent.postMessage({type:'html-lab-navigate',token:document.currentScriptToken,path:path},'*');else if(link.hash){var target=document.getElementById(link.hash.slice(1));if(target)target.scrollIntoView();}},true);function reportSize(){parent.postMessage({type:'html-lab-metrics',token:document.currentScriptToken,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1},'*')}window.addEventListener('load',reportSize);window.addEventListener('resize',reportSize);`;
export function projectPreview(files, page, token) {
  if (typeof token !== "string" || !/^[a-zA-Z0-9_-]{16,64}$/.test(token))
    throw Error("The preview requires an application-generated nonce.");
  const entry = files[page];
  if (!entry || entry.type !== "text" || !/\.html?$/i.test(page))
    return {
      html: "<p>Choose an HTML file to preview.</p>",
      links: [],
      issues: ["No HTML page selected."],
    };
  const doc = new DOMParser().parseFromString(entry.data, "text/html");
  const links = [],
    issues = [];
  const css = (source, from) =>
    source
      .replace(
        /@import\b[^;]*(?:;|$)/gi,
        "/* External imports are disabled. */",
      )
      .replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi, (_, q, url) => {
        const path = resolvePath(from, url);
        const asset = path && files[path];
        if (asset?.type === "image") return `url("${asset.data}")`;
        issues.push(`CSS image unavailable: ${url}`);
        return 'url("data:,")';
      })
      .replace(/<\/style/gi, "<\\/style");
  doc
    .querySelectorAll(
      "script,iframe,object,embed,base,meta[http-equiv],svg,math,template,noscript,area",
    )
    .forEach((n) => n.remove());
  doc.querySelectorAll("*").forEach((el) => {
    for (const a of [...el.attributes])
      if (
        /^on/i.test(a.name) ||
        [
          "nonce",
          "srcdoc",
          "ping",
          "srcset",
          "integrity",
          "crossorigin",
        ].includes(a.name.toLowerCase())
      )
        el.removeAttribute(a.name);
    if (el.hasAttribute("style"))
      el.setAttribute("style", css(el.getAttribute("style"), page));
  });
  doc.querySelectorAll("style").forEach((s) => {
    s.textContent = css(s.textContent, page);
  });
  doc.querySelectorAll("link").forEach((link) => {
    const path = resolvePath(page, link.getAttribute("href"));
    if (
      link.rel === "stylesheet" &&
      path &&
      files[path]?.type === "text" &&
      path.endsWith(".css")
    ) {
      const style = doc.createElement("style");
      style.textContent = css(files[path].data, path);
      link.replaceWith(style);
    } else {
      issues.push(
        `Stylesheet unavailable or unsupported: ${link.getAttribute("href") || "(no href)"}`,
      );
      link.remove();
    }
  });
  doc.querySelectorAll("img").forEach((img) => {
    const path = resolvePath(page, img.getAttribute("src"));
    if (path && files[path]?.type === "image") img.src = files[path].data;
    else {
      issues.push(
        `Image unavailable: ${img.getAttribute("src") || "(no src)"}`,
      );
      img.removeAttribute("src");
    }
  });
  doc.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#")) return;
    const path = resolvePath(page, href);
    a.removeAttribute("href");
    a.removeAttribute("target");
    if (path && files[path]?.type === "text" && /\.html?$/i.test(path)) {
      a.setAttribute("data-project-page", path);
      a.setAttribute("href", "#");
      links.push({ path, text: a.textContent || path });
    } else {
      issues.push(`Link unavailable in this workspace: ${href}`);
      a.title = "Only local project HTML links work in this preview.";
    }
  });
  doc.querySelectorAll("form").forEach((f) => {
    f.removeAttribute("action");
    f.removeAttribute("target");
  });
  doc.querySelectorAll("audio,video,source,track").forEach((n) => {
    n.removeAttribute("src");
  });
  const policy = doc.createElement("meta");
  policy.httpEquiv = "Content-Security-Policy";
  policy.content = `default-src 'none'; script-src 'nonce-${token}'; script-src-attr 'none'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'`;
  doc.head.prepend(policy);
  const script = doc.createElement("script");
  script.setAttribute("nonce", token);
  script.textContent = `document.currentScriptToken=${JSON.stringify(token)};${PROJECT_BRIDGE}`;
  doc.body.append(script);
  return {
    html: "<!DOCTYPE html>\n" + doc.documentElement.outerHTML,
    links,
    issues: [...new Set(issues)],
  };
}
