(() => {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const STORAGE_KEY = "_empty_app_body_html";
    const STORAGE_KEY_AUTOSAVE = "_empty_app_autosave";

    class EmptyApp {
        constructor() {
            this.reset = this.reset.bind(this);
            this.clear = this.clear.bind(this);
            this.save = this.save.bind(this);
            this.autosave = this.autosave.bind(this);
            this.detectChanges = this.detectChanges.bind(this);

            this.localStorage = window.localStorage;
            this.enabledAutosave = this.loadAutosaveSettings();
            this.loadExisting();
            this.detectChanges();
        }

        detectChanges() {
            requestAnimationFrame(this.detectChanges);
            if (this.enabledAutosave) {
                this.saveChanges();
            }
        }

        saveChanges() {
            const $body = document.body;
            const bodyHtmlString = $body.innerHTML;
            this.localStorage.setItem(STORAGE_KEY, bodyHtmlString);
        }

        loadExisting() {
            const bodyHtmlString = this.localStorage.getItem(STORAGE_KEY);
            const $body = document.body;
            if (typeof bodyHtmlString === "string") {
                $body.innerHTML = bodyHtmlString;
                this.runScripts();
            } else {
                this.loadDefault();
            }
        }

        loadDefault() {
            const $body = document.body;
            $body.innerHTML = DEFAULT_HTML_STRING;
        }

        loadAutosaveSettings() {
            let autosave = this.localStorage.getItem(STORAGE_KEY_AUTOSAVE);
            if (!autosave) return true; // by default autosave is enabled
            return JSON.parse(autosave);
        }

        reset() {
            this.localStorage.removeItem(STORAGE_KEY);
            this.localStorage.removeItem(STORAGE_KEY_AUTOSAVE);
            this.loadExisting();
        }

        clear() {
            this.localStorage.setItem(STORAGE_KEY, "");
            this.loadExisting();
        }

        autosave(enabled) {
            this.enabledAutosave = enabled;
            this.localStorage.setItem(
                STORAGE_KEY_AUTOSAVE,
                JSON.stringify(enabled)
            );
        }

        save() {
            this.saveChanges();
        }

        async runScripts() {
            function nodeName(elem, name) {
                return (
                    elem.nodeName &&
                    elem.nodeName.toUpperCase() === name.toUpperCase()
                );
            }

            function evalScript(elem) {
                return new Promise((resolve) => {
                    var data =
                            elem.text ||
                            elem.textContent ||
                            elem.innerHTML ||
                            "",
                        head =
                            document.getElementsByTagName("head")[0] ||
                            document.documentElement,
                        script = document.createElement("script");
                    script.type = "text/javascript";
                    script.onload = script.onerror = resolve;
                    if (elem.src) {
                        script.src = elem.src;
                    }
                    try {
                        script.appendChild(document.createTextNode(data));
                    } catch (e) {
                        script.text = data;
                    }

                    head.insertBefore(script, head.firstChild);
                    head.removeChild(script);
                });
            }

            var scripts = [],
                script,
                children_nodes = document.body.childNodes,
                child,
                i;

            for (i = 0; children_nodes[i]; i++) {
                child = children_nodes[i];
                if (
                    nodeName(child, "script") &&
                    (!child.type ||
                        child.type.toLowerCase() === "text/javascript")
                ) {
                    scripts.push(child);
                }
            }

            for (i = 0; scripts[i]; i++) {
                script = scripts[i];
                await evalScript(scripts[i]);
            }
        }
    }

    window.onload = () => {
        const emptyApp = new EmptyApp();
        window["app"] = {
            clear: emptyApp.clear,
            reset: emptyApp.reset,
            save: emptyApp.save,
            autosave: emptyApp.autosave,
        };
    };
})();

const DEFAULT_HTML_STRING = `

<link href="https://fonts.googleapis.com/css2?family=Roboto&amp;display=swap" rel="stylesheet">
<style>
    body {
        padding: 100px 20px;
        font-family: "Roboto", sans-serif;
        line-height: 2;
        color: #333333;
    }

    #box {
        max-width: 400px;
        width: 100%;
        margin: 0 auto;
    }

    #logo {
        width: 100px;
        height: auto;
    }

    h1 {
        display: flex;
        align-items: center;
        font-size: 26px;
        line-height: 1.5;
    }

    h1 span {
        margin-top: 17px;
        margin-left: 10px;
    }

    ol {
        margin: 0;
        padding: 0;
        margin-top: 20px;
        padding-left: 1rem;
        margin-bottom: 50px;
    }

    li {
        margin-bottom: 20px;
    }

    #twitter-icon {
        width: 12px;
    }

    .highlight {
        border: 1px solid #6d6d6d;
        color: #484848;
        padding: 3px 5px;
        font-size: 14px;
        letter-spacing: 2px;
    }
</style>
<div id="box">
    <h1>
        <img id="logo" src="/logo.png" alt="empty app logo">
        <span>Empty App</span>
    </h1>

    <p>
        This is an HTML sandbox. You can edit DOM directly in Developers
        Tools and it will be saved. After refresh, you will see the last
        state of DOM
    </p>

    <ol>
        <li>Open Developer Tools (F12 key)</li>
        <li>
            In the Elements tab (or Inspector in Firefox), you can edit
            the DOM. Any changes to the
            <span class="highlight">&lt;body /&gt;</span> tag will be
            kept. Changes in any tag outside the body will be lost.
        </li>
        <li>
            To clear body tag, in Console use the following command:
            <span class="highlight">app.clear()</span>
        </li>
        <li>
            To reset Empty App to this (default) message, use the
            following command:
            <span class="highlight">app.reset()</span>
        </li>
        <li>
            The <span class="highlight">&lt;script /&gt;</span> tags are supported, 
            but before using it, the recommendation is to disable autosave (which is enabled by default), 
            because of possible DOM changes by JavaScript. 
            Disable autosave with <span class="highlight">app.autosave(false)</span>. 
            To save changes manually: <span class="highlight">app.save()</span>
        </li>
    </ol>

    <p>
        Stay tuned:
        <a href="https://twitter.com/epranka" class="highlight"><img id="twitter-icon" src="/twitter.png"> epranka</a>
        <a href="https://github.com/epranka/empty-app" class="highlight">github</a>
        <a href="https://linkedin.com/in/epranka" class="highlight">linkedin</a>
        <a href="https://dev.to/epranka" class="highlight">dev.to</a>
    </p>
</div>
`;
