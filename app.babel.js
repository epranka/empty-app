(() => {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const STORAGE_KEY = "_empty_app_body_html";

    class EmptyApp {
        constructor() {
            this.reset = this.reset.bind(this);
            this.clear = this.clear.bind(this);

            this.localStorage = window.localStorage;
            this.loadExisting();
            this.observer = new MutationObserver(this.handleChanges.bind(this));
            this.observer.observe(document, {
                subtree: true,
                attributes: true,
                childList: true,
            });
        }

        handleChanges() {
            const $body = document.body;
            const bodyHtmlString = $body.innerHTML;
            this.localStorage.setItem(STORAGE_KEY, bodyHtmlString);
        }

        loadExisting() {
            const bodyHtmlString = this.localStorage.getItem(STORAGE_KEY);
            const $body = document.body;
            if (typeof bodyHtmlString === "string") {
                $body.innerHTML = bodyHtmlString;
            } else {
                this.loadDefault();
            }
        }

        loadDefault() {
            const $body = document.body;
            $body.innerHTML = DEFAULT_HTML_STRING;
        }

        reset() {
            this.localStorage.removeItem(STORAGE_KEY);
            this.loadExisting();
        }

        clear() {
            this.localStorage.setItem(STORAGE_KEY, "");
            this.loadExisting();
        }
    }

    window.onload = () => {
        const emptyApp = new EmptyApp();
        window["EmptyApp"] = {
            clear: emptyApp.clear,
            reset: emptyApp.reset,
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
            <span class="highlight">EmptyApp.clear()</span>
        </li>
        <li>
            To reset Empty App to this (default) message, use the
            following command:
            <span class="highlight">EmptyApp.reset()</span>
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
