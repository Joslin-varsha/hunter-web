(function () {
    if (window.HunterWidgetInitialized) return;
    window.HunterWidgetInitialized = true;

    // Detect configuration from script data attributes
    const scriptTag = document.currentScript || document.querySelector('script[src*="hunter-widget.js"]');
    const API_URL = scriptTag?.dataset?.apiUrl || "http://localhost:8001";
    const CLIENT_ID = scriptTag?.dataset?.clientId || "hunter_store";
    const USER_ID = "hunter_user_" + Math.random().toString(36).substring(2, 9);

    // Global Widget State
    let isWindowOpen = false;
    let widgetConfig = {
        botName: "HUNTER AI Stylist",
        brandName: "HUNTER",
        primaryColor: "#09090b",
        accentColor: "#e11d48",
        welcomeTitle: "Wassup! 🔥",
        welcomeSubtitle: "Welcome to HUNTER Streetwear. Looking for heavy oversized hoodies, cargos, or kicks?",
        inputPlaceholder: "Ask about streetwear, fit guide, drops...",
        chips: [
            "🔥 Heavy Oversized Hoodies",
            "👖 Tactical Cargo Pants",
            "👟 High-Top Sneakers",
            "🚚 Shipping & Delivery",
            "📏 Size & Fit Guide"
        ]
    };

    // Inject Custom Styles (HUNTER Streetwear Dark / Crimson Theme)
    const style = document.createElement("style");
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        #h-widget-container * {
            box-sizing: border-box;
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        #h-widget-trigger {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 62px;
            height: 62px;
            border-radius: 50%;
            background: linear-gradient(135deg, #09090b 0%, #18181b 100%);
            border: 2px solid #e11d48;
            box-shadow: 0 8px 24px rgba(225, 29, 72, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999999;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }

        #h-widget-trigger:hover {
            transform: scale(1.08) translateY(-2px);
            box-shadow: 0 12px 28px rgba(225, 29, 72, 0.6);
        }

        #h-widget-trigger svg {
            width: 28px;
            height: 28px;
            fill: none;
            stroke: #ffffff;
            stroke-width: 2.2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        #h-widget-badge {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 14px;
            height: 14px;
            background: #e11d48;
            border: 2px solid #09090b;
            border-radius: 50%;
            animation: pulse-red 2s infinite;
        }

        @keyframes pulse-red {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(225, 29, 72, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
        }

        #h-widget-window {
            position: fixed;
            bottom: 96px;
            right: 24px;
            width: 380px;
            max-width: calc(100vw - 32px);
            height: 580px;
            max-height: calc(100vh - 120px);
            background: #09090b;
            border: 1px solid #27272a;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.05);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 999998;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        #h-widget-window.open {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }

        .h-header {
            background: linear-gradient(180deg, #18181b 0%, #09090b 100%);
            padding: 16px 20px;
            border-bottom: 1px solid #27272a;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .h-header-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .h-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: #e11d48;
            color: #ffffff;
            font-weight: 800;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: -0.5px;
            box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
        }

        .h-header-title {
            color: #ffffff;
            font-weight: 700;
            font-size: 15px;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .h-online-dot {
            width: 8px;
            height: 8px;
            background: #22c55e;
            border-radius: 50%;
            display: inline-block;
        }

        .h-header-subtitle {
            color: #a1a1aa;
            font-size: 12px;
            margin-top: 2px;
        }

        .h-close-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #a1a1aa;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .h-close-btn:hover {
            background: #e11d48;
            border-color: #e11d48;
            color: #ffffff;
        }

        .h-chat-body {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 14px;
            background: #09090b;
        }

        .h-message {
            display: flex;
            flex-direction: column;
            max-width: 86%;
            animation: fadeInMsg 0.3s ease;
        }

        @keyframes fadeInMsg {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .h-message.user {
            align-self: flex-end;
        }

        .h-message.bot {
            align-self: flex-start;
        }

        .h-bubble {
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
        }

        .h-message.user .h-bubble {
            background: #e11d48;
            color: #ffffff;
            border-bottom-right-radius: 4px;
            font-weight: 500;
        }

        .h-message.bot .h-bubble {
            background: #18181b;
            color: #f4f4f5;
            border: 1px solid #27272a;
            border-bottom-left-radius: 4px;
        }

        .h-bubble strong {
            color: #ffffff;
        }

        .h-chips-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
        }

        .h-chip {
            background: #18181b;
            border: 1px solid #27272a;
            color: #d4d4d8;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .h-chip:hover {
            border-color: #e11d48;
            color: #ffffff;
            background: rgba(225, 29, 72, 0.15);
        }

        .h-products-grid {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding: 8px 0 12px 0;
            margin-top: 6px;
            scrollbar-width: thin;
        }

        .h-product-card {
            min-width: 140px;
            max-width: 140px;
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .h-product-card:hover {
            transform: translateY(-2px);
            border-color: #e11d48;
        }

        .h-product-img {
            width: 100%;
            height: 90px;
            object-fit: cover;
            border-radius: 8px;
            background: #09090b;
        }

        .h-product-title {
            color: #f4f4f5;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .h-product-price {
            color: #e11d48;
            font-size: 13px;
            font-weight: 700;
        }

        .h-product-link {
            display: block;
            text-align: center;
            background: #09090b;
            border: 1px solid #27272a;
            color: #ffffff;
            padding: 6px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            text-decoration: none;
            margin-top: auto;
            transition: all 0.2s ease;
        }

        .h-product-link:hover {
            background: #e11d48;
            border-color: #e11d48;
        }

        .h-input-area {
            padding: 14px;
            border-top: 1px solid #27272a;
            background: #09090b;
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .h-input {
            flex: 1;
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 10px 14px;
            color: #ffffff;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s ease;
        }

        .h-input:focus {
            border-color: #e11d48;
        }

        .h-input::placeholder {
            color: #71717a;
        }

        .h-send-btn {
            background: #e11d48;
            border: none;
            color: #ffffff;
            width: 40px;
            height: 40px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, background 0.2s ease;
        }

        .h-send-btn:hover {
            background: #f43f5e;
            transform: scale(1.05);
        }

        .h-send-btn svg {
            width: 18px;
            height: 18px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2.2;
        }
    `;
    document.head.appendChild(style);

    // Build Widget DOM Container
    const container = document.createElement("div");
    container.id = "h-widget-container";
    container.innerHTML = `
        <div id="h-widget-trigger">
            <div id="h-widget-badge"></div>
            <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>

        <div id="h-widget-window">
            <div class="h-header">
                <div class="h-header-info">
                    <div class="h-avatar">H</div>
                    <div>
                        <h4 class="h-header-title">${widgetConfig.botName} <span class="h-online-dot"></span></h4>
                        <div class="h-header-subtitle">Official AI Stylist</div>
                    </div>
                </div>
                <button class="h-close-btn" id="h-close-btn">✕</button>
            </div>

            <div class="h-chat-body" id="h-chat-body">
                <div class="h-message bot">
                    <div class="h-bubble">
                        <strong>${widgetConfig.welcomeTitle}</strong><br>
                        ${widgetConfig.welcomeSubtitle}
                    </div>
                </div>
                <div class="h-chips-container" id="h-chips-container">
                    ${widgetConfig.chips.map(chip => `<button class="h-chip" data-chip="${chip}">${chip}</button>`).join('')}
                </div>
            </div>

            <div class="h-input-area">
                <input type="text" class="h-input" id="h-input" placeholder="${widgetConfig.inputPlaceholder}">
                <button class="h-send-btn" id="h-send-btn">
                    <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // Fetch Dynamic Widget Config from API
    fetch(`${API_URL}/widget/config`)
        .then(res => res.json())
        .then(cfg => {
            if (cfg) {
                widgetConfig = { ...widgetConfig, ...cfg };
            }
        })
        .catch(() => {});

    // Elements
    const trigger = document.getElementById("h-widget-trigger");
    const win = document.getElementById("h-widget-window");
    const closeBtn = document.getElementById("h-close-btn");
    const chatBody = document.getElementById("h-chat-body");
    const input = document.getElementById("h-input");
    const sendBtn = document.getElementById("h-send-btn");

    // Toggle Window
    function toggleWindow() {
        isWindowOpen = !isWindowOpen;
        if (isWindowOpen) {
            win.classList.add("open");
            const badge = document.getElementById("h-widget-badge");
            if (badge) badge.style.display = "none";
            input.focus();
        } else {
            win.classList.remove("open");
        }
    }

    trigger.addEventListener("click", toggleWindow);
    closeBtn.addEventListener("click", toggleWindow);

    // Format Simple Markdown
    function parseMarkdown(str) {
        if (!str) return "";
        let html = str
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^-\s+(.*)$/gbm, '• $1<br>')
            .replace(/\n/g, '<br>');
        return html;
    }

    // Append Message
    function appendMessage(role, text, sources = []) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `h-message ${role}`;

        let contentHtml = `<div class="h-bubble">${parseMarkdown(text)}</div>`;

        if (sources && sources.length > 0) {
            contentHtml += `<div class="h-products-grid">`;
            sources.forEach(p => {
                const img = p.image_url || p.image || '/images/supreme.jpg';
                contentHtml += `
                    <div class="h-product-card">
                        <img src="${img}" class="h-product-img" alt="${p.title}" onerror="this.src='/images/supreme.jpg'">
                        <div class="h-product-title">${p.title}</div>
                        <div class="h-product-price">$${p.price}</div>
                        <a href="${p.product_url || '/products/' + p.product_id}" class="h-product-link">View Drop</a>
                    </div>
                `;
            });
            contentHtml += `</div>`;
        }

        msgDiv.innerHTML = contentHtml;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Send User Query
    function sendMessage(text) {
        const query = (text || input.value).trim();
        if (!query) return;

        input.value = "";
        appendMessage("user", query);

        // Typing Indicator
        const typingDiv = document.createElement("div");
        typingDiv.className = "h-message bot";
        typingDiv.id = "h-typing-indicator";
        typingDiv.innerHTML = `<div class="h-bubble" style="color: #71717a;">HUNTER Stylist is searching drops...</div>`;
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Client-ID": CLIENT_ID
            },
            body: JSON.stringify({
                user_id: USER_ID,
                message: query,
                client_id: CLIENT_ID
            })
        })
        .then(res => res.json())
        .then(data => {
            const typing = document.getElementById("h-typing-indicator");
            if (typing) typing.remove();

            if (data.success && data.answer) {
                appendMessage("bot", data.answer, data.sources || []);
            } else {
                appendMessage("bot", "Check out our full streetwear drops on HUNTER!");
            }
        })
        .catch(err => {
            const typing = document.getElementById("h-typing-indicator");
            if (typing) typing.remove();
            appendMessage("bot", "⚡ Need style recommendations? Browse our top categories or check back shortly!");
        });
    }

    sendBtn.addEventListener("click", () => sendMessage());
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // Chip Click Listener
    chatBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("h-chip")) {
            const chipText = e.target.dataset.chip;
            sendMessage(chipText);
        }
    });
})();
