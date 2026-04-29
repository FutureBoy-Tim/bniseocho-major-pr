/* Share Kit · BNI 서초 메이저 챕터
 * Drop-in 외부 공유 모달.
 *   <div id="shareKitRoot"></div> 가 페이지에 있으면 자동 마운트.
 *   ShareKit.open({mode:'chapter'|'member', member, data}) 로 열기.
 */
(function(){
  if(window.ShareKit) return;

  const TPL_CSS = `
  .sk-overlay{position:fixed;inset:0;background:rgba(8,12,30,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:300;display:none;align-items:flex-end;justify-content:center;padding:0}
  .sk-overlay.open{display:flex}
  @media(min-width:760px){.sk-overlay{align-items:center;padding:24px}}
  .sk-panel{background:#fff;width:100%;max-width:760px;border-radius:24px 24px 0 0;box-shadow:0 -20px 60px rgba(0,0,0,.4);max-height:92vh;overflow-y:auto;animation:sk-rise .28s cubic-bezier(.2,.7,.2,1)}
  @media(min-width:760px){.sk-panel{border-radius:24px;max-height:88vh;animation:sk-pop .25s cubic-bezier(.2,.7,.2,1)}}
  @keyframes sk-rise{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes sk-pop{from{transform:scale(.96);opacity:0}to{transform:scale(1);opacity:1}}
  .sk-head{position:sticky;top:0;background:#fff;padding:20px 24px 14px;border-bottom:1px solid #E5E8EF;display:flex;align-items:center;gap:12px;z-index:2}
  .sk-head h2{margin:0;font-size:18px;letter-spacing:-.01em;font-weight:800;flex:1}
  .sk-head .sk-eyebrow{font-size:10px;font-weight:800;letter-spacing:.1em;color:#FF8200;text-transform:uppercase;display:block;margin-bottom:2px}
  .sk-close{width:36px;height:36px;border-radius:50%;background:#F1F3F8;display:grid;place-items:center;font-size:16px;color:#3A435A;transition:background .15s;border:none;cursor:pointer}
  .sk-close:hover{background:#E5E8EF}
  .sk-body{padding:20px 24px 28px}

  .sk-tabs{display:flex;gap:6px;background:#F1F3F8;padding:4px;border-radius:999px;margin-bottom:18px}
  .sk-tab{flex:1;padding:9px 14px;border-radius:999px;font-size:13px;font-weight:700;color:#3A435A;text-align:center;transition:all .15s;cursor:pointer;border:none;background:transparent}
  .sk-tab.active{background:#fff;color:#0E1F5C;box-shadow:0 1px 4px rgba(14,31,92,.1)}

  .sk-link{display:flex;gap:8px;align-items:center;padding:14px 16px;background:#F8F9FC;border:1px solid #E5E8EF;border-radius:14px;margin-bottom:14px}
  .sk-link-url{flex:1;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;color:#0E1422;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .sk-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:999px;font-weight:700;font-size:12px;letter-spacing:-.01em;cursor:pointer;border:none;transition:all .12s;white-space:nowrap}
  .sk-btn-primary{background:#0E1F5C;color:#fff}
  .sk-btn-primary:hover{background:#1B3380}
  .sk-btn-orange{background:#FF8200;color:#fff}
  .sk-btn-orange:hover{background:#FF6A00}
  .sk-btn-outline{background:#fff;color:#0E1422;border:1px solid #E5E8EF}
  .sk-btn-outline:hover{border-color:#0E1F5C;color:#0E1F5C}

  .sk-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
  @media(max-width:560px){.sk-grid{grid-template-columns:1fr}}
  .sk-tpl-card{background:#fff;border:1px solid #E5E8EF;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:8px}
  .sk-tpl-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
  .sk-tpl-name{font-size:13px;font-weight:800;letter-spacing:-.01em;color:#0E1422}
  .sk-tpl-tag{font-size:10px;font-weight:700;color:#A95400;background:#FFF4E5;padding:3px 8px;border-radius:999px;letter-spacing:.04em}
  .sk-tpl-body{font-size:13px;color:#3A435A;line-height:1.55;white-space:pre-line;background:#FAFBFD;border-radius:10px;padding:12px;flex:1;border:1px solid #F1F3F8;max-height:140px;overflow-y:auto}

  .sk-channels{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:18px}
  .sk-channel{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;background:#fff;border:1px solid #E5E8EF;border-radius:14px;color:#0E1422;font-size:12px;font-weight:700;transition:all .15s;cursor:pointer}
  .sk-channel:hover{transform:translateY(-2px);border-color:#0E1F5C;box-shadow:0 6px 20px rgba(14,31,92,.08)}
  .sk-channel-icon{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;color:#fff;font-weight:900}
  .sk-c-kakao{background:#FEE500;color:#0E1422}
  .sk-c-mail{background:#0E1F5C}
  .sk-c-link{background:#FF8200}
  .sk-c-fb{background:#1877F2}
  .sk-c-li{background:#0A66C2}
  .sk-c-x{background:#0E1422}
  .sk-c-sms{background:#34A853}

  .sk-qr-wrap{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center;background:#FFF4E5;border:1px solid #FFD09A;border-radius:16px;padding:16px}
  .sk-qr-canvas{width:120px;height:120px;background:#fff;border-radius:10px;padding:6px}
  .sk-qr-canvas canvas{width:100%;height:100%;display:block}
  .sk-qr-info h3{margin:0 0 4px;font-size:14px;font-weight:800;letter-spacing:-.01em}
  .sk-qr-info p{margin:0 0 8px;font-size:12px;color:#3A435A;line-height:1.5}
  .sk-qr-actions{display:flex;gap:6px;flex-wrap:wrap}

  .sk-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:#0E1F5C;color:#fff;padding:11px 18px;border-radius:999px;font-size:13px;font-weight:700;box-shadow:0 12px 32px rgba(14,31,92,.4);opacity:0;transition:all .25s;pointer-events:none;z-index:400}
  .sk-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

  .sk-section-label{font-size:11px;font-weight:800;letter-spacing:.1em;color:#6B7388;text-transform:uppercase;margin:18px 0 10px;display:block}
  .sk-preview{display:flex;gap:12px;align-items:center;background:#fff;border:1px solid #E5E8EF;border-radius:14px;padding:12px;margin-bottom:18px}
  .sk-preview-img{width:64px;height:64px;border-radius:10px;background:#F1F3F8;flex-shrink:0;background-size:cover;background-position:center}
  .sk-preview-text{flex:1;min-width:0}
  .sk-preview-title{font-size:13px;font-weight:700;color:#0E1422;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .sk-preview-desc{font-size:12px;color:#6B7388;margin:2px 0 0;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .sk-preview-domain{font-size:11px;color:#9098AC;margin:4px 0 0;letter-spacing:.02em;text-transform:uppercase;font-weight:700}
  `;

  function injectCSS(){
    if(document.getElementById("sk-css")) return;
    const s = document.createElement("style"); s.id = "sk-css"; s.textContent = TPL_CSS;
    document.head.appendChild(s);
  }

  function buildTemplates(ctx){
    const url = ctx.url;
    const chapName = "BNI 서초 메이저 챕터";
    if(ctx.mode === "member" && ctx.member){
      const m = ctx.member;
      return [
        { name:"한 줄로 짧게", tag:"카톡/DM",
          body:`[${chapName} 추천] ${m.company} · ${m.name} 대표 — ${m.tagline||""}\n${url}` },
        { name:"친근하게", tag:"단톡/지인",
          body:`이번 주 ${chapName}이 추천하는 분이에요!\n\n${m.company} · ${m.name} 대표\n"${m.tagline||""}"\n\n${m.subTagline||""}\n\n혹시 주변에 ${(m.referralTargets||[])[0]||"관심 있는 분"}이 계시면 한번 봐주세요 :)\n\n${url}` },
        { name:"격식 있게", tag:"이메일/링크드인",
          body:`안녕하세요. ${chapName} 멤버 한 분을 소개드립니다.\n\n${m.company} · ${m.title||"대표"} ${m.name}\n— ${m.tagline||""}\n\n전문 분야:\n${(m.expertise||[]).map(x=>"• "+x).join("\n")}\n\n주요 리퍼럴 타깃:\n${(m.referralTargets||[]).map(x=>"• "+x).join("\n")}\n\n자세한 소개와 자료는 아래 링크에서 확인하실 수 있습니다.\n${url}\n\n연락처: ${m.phone||""} / ${m.email||""}` },
        { name:"길게 풀어서", tag:"커뮤니티 게시글",
          body:`📢 [${chapName}] 이번 주 추천 멤버\n\n${m.company} · ${m.title||"대표"} ${m.name}\n\n${m.tagline||""}\n${m.subTagline||""}\n\n어떤 분야:\n${(m.expertise||[]).map(x=>"✓ "+x).join("\n")}\n\n어떤 분을 만나고 싶으신가요:\n${(m.referralTargets||[]).map(x=>"→ "+x).join("\n")}\n\n📑 디지털 명함 · 인포그래픽 · 상세 PPT 모두 아래 링크에서 보실 수 있습니다.\n${url}\n\n📞 ${m.phone||""}\n✉️ ${m.email||""}` }
      ];
    }
    // chapter mode
    const featured = ctx.data?.members?.find(x=>x.id===ctx.data?.featuredId);
    return [
      { name:"한 줄로 짧게", tag:"카톡/DM",
        body:`[${chapName}] 매주 한 명, 39명의 대표를 깊이 소개합니다.\n${url}` },
      { name:"친근하게", tag:"단톡/지인",
        body:`서초 BNI 메이저 챕터 멤버 39명을 매주 한 명씩 소개하는 페이지를 만들었어요!\n\n${featured?`이번 주는 ${featured.company} · ${featured.name} 대표님 (${featured.industry||""})입니다.`:""}\n\n다양한 업종의 대표님들이 계세요. 혹시 찾고 계신 분이 있다면 둘러보세요 :)\n\n${url}` },
      { name:"격식 있게", tag:"이메일/링크드인",
        body:`안녕하세요. ${chapName}을 소개드립니다.\n\n저희 챕터는 39명의 다양한 업종 대표가 매주 모여 서로의 사업을 추천하는 비즈니스 네트워킹 모임입니다. 매주 한 분씩 디지털 명함·인포그래픽·상세 자료까지 공개하여, 외부에서도 멤버를 정확히 이해하고 적합한 분을 추천하실 수 있도록 운영하고 있습니다.\n\n${featured?`이번 주 소개되는 분은 ${featured.company}의 ${featured.name} ${featured.title||"대표"}님입니다 — ${featured.tagline||""}.`:""}\n\n자세한 내용은 아래에서 확인 부탁드립니다.\n${url}` },
      { name:"길게 풀어서", tag:"커뮤니티 게시글",
        body:`📢 ${chapName}\n매주 한 명의 대표를 깊이 있게 소개합니다.\n\n39명, 다양한 업종.\n재무·세무 / 의료 / 법률 / 마케팅 / 제조유통 / 금융 / IT / 라이프스타일 등.\n\n각 멤버마다 4종 자료가 공개됩니다:\n✓ 디지털 명함 (한 장 핵심)\n✓ 실물 명함 앞·뒤\n✓ 한 페이지 인포그래픽\n✓ 상세 소개 PPT\n\n${featured?`🌟 이번 주 피처드: ${featured.company} · ${featured.name} 대표 — ${featured.tagline||""}`:""}\n\n혹시 찾고 계신 전문가가 있다면, 한번 둘러보세요.\n${url}` }
    ];
  }

  function buildHTML(ctx){
    const tpls = buildTemplates(ctx);
    const tplCards = tpls.map((t,i)=>`
      <div class="sk-tpl-card" data-tpl-i="${i}">
        <div class="sk-tpl-head">
          <span class="sk-tpl-name">${t.name}</span>
          <span class="sk-tpl-tag">${t.tag}</span>
        </div>
        <div class="sk-tpl-body" id="sk-tpl-body-${i}">${t.body.replace(/</g,"&lt;")}</div>
        <button class="sk-btn sk-btn-outline" data-copy-tpl="${i}">📋 이 톤으로 복사</button>
      </div>`).join("");

    const headEyebrow = ctx.mode === "member" ? "이 대표님을 외부에 추천하기" : "챕터를 외부 커뮤니티에 알리기";
    const headTitle = ctx.mode === "member" ? `${ctx.member?.name||""} 대표 공유 키트` : "공유 키트";
    const previewTitle = ctx.mode === "member"
      ? `${ctx.member?.name||""} 대표 · ${ctx.member?.company||""} · BNI 서초 메이저`
      : "BNI 서초 메이저 챕터 · 멤버 PR";
    const previewDesc = ctx.mode === "member"
      ? (ctx.member?.tagline||"") + (ctx.member?.subTagline?" — "+ctx.member.subTagline:"")
      : "매주 한 명, 39명의 대표를 깊이 있게 소개합니다.";
    const previewImg = ctx.mode === "member" && ctx.member?.assets?.digitalCard
      ? new URL(ctx.member.assets.digitalCard, location.href).toString()
      : "";

    return `
      <div class="sk-head">
        <div style="flex:1">
          <span class="sk-eyebrow">${headEyebrow}</span>
          <h2>${headTitle}</h2>
        </div>
        <button class="sk-close" id="sk-close" aria-label="닫기">✕</button>
      </div>
      <div class="sk-body">
        ${ctx.modes.length > 1 ? `
        <div class="sk-tabs">
          ${ctx.modes.map(mo => `<button class="sk-tab ${mo.key===ctx.mode?'active':''}" data-mode="${mo.key}">${mo.label}</button>`).join("")}
        </div>` : ""}

        <span class="sk-section-label">공유 미리보기</span>
        <div class="sk-preview">
          <div class="sk-preview-img" style="${previewImg?`background-image:url('${previewImg}')`:''}"></div>
          <div class="sk-preview-text">
            <div class="sk-preview-title">${previewTitle}</div>
            <div class="sk-preview-desc">${previewDesc}</div>
            <div class="sk-preview-domain">${(new URL(ctx.url)).hostname || "Local"}</div>
          </div>
        </div>

        <span class="sk-section-label">공유 링크</span>
        <div class="sk-link">
          <span class="sk-link-url">${ctx.url}</span>
          <button class="sk-btn sk-btn-orange" id="sk-copy-url">📋 복사</button>
        </div>

        <span class="sk-section-label">채널별 직접 공유</span>
        <div class="sk-channels">
          ${ch("kakao", "카카오톡", "💬", ctx.url, previewTitle)}
          ${ch("link", "링크 복사", "🔗", ctx.url, previewTitle)}
          ${ch("mail", "이메일", "✉", ctx.url, previewTitle)}
          ${ch("li", "링크드인", "in", ctx.url, previewTitle)}
          ${ch("fb", "페이스북", "f", ctx.url, previewTitle)}
          ${ch("x", "X (Twitter)", "𝕏", ctx.url, previewTitle)}
          ${ch("sms", "문자", "💬", ctx.url, previewTitle)}
        </div>

        <span class="sk-section-label">상황별 메시지 템플릿</span>
        <div class="sk-grid">${tplCards}</div>

        <span class="sk-section-label">QR 코드</span>
        <div class="sk-qr-wrap">
          <div class="sk-qr-canvas"><canvas id="sk-qr"></canvas></div>
          <div class="sk-qr-info">
            <h3>오프라인에서도 바로 공유</h3>
            <p>인쇄물·발표 슬라이드·명함 뒷면에 QR을 넣어 공유하세요. 카메라로 찍으면 이 페이지가 바로 열립니다.</p>
            <div class="sk-qr-actions">
              <button class="sk-btn sk-btn-primary" id="sk-qr-download">⬇ PNG 다운로드</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function ch(kind, label, icon, url, title){
    return `<button class="sk-channel" data-share="${kind}"><span class="sk-channel-icon sk-c-${kind}">${icon}</span><span>${label}</span></button>`;
  }

  function shareTo(kind, url, title){
    const u = encodeURIComponent(url), t = encodeURIComponent(title);
    const map = {
      kakao: `https://accounts.kakao.com/login?continue=${encodeURIComponent("https://sharer.kakao.com/talk/friends/picker/link?url="+url+"&text="+title)}`,
      mail: `mailto:?subject=${t}&body=${u}`,
      li: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      fb: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      sms: `sms:?body=${t}%20${u}`
    };
    if(kind === "link"){ navigator.clipboard.writeText(url).then(()=>toast("링크가 복사되었습니다")); return; }
    const target = map[kind]; if(!target) return;
    if(kind === "sms" || kind === "mail"){ location.href = target; return; }
    window.open(target, "_blank", "width=620,height=720,noopener");
  }

  function toast(msg){
    let t = document.getElementById("sk-toast");
    if(!t){ t = document.createElement("div"); t.id = "sk-toast"; t.className = "sk-toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove("show"), 2000);
  }

  let _ctx = null;

  function open(opts){
    injectCSS();
    let overlay = document.getElementById("sk-overlay");
    if(!overlay){
      overlay = document.createElement("div");
      overlay.id = "sk-overlay";
      overlay.className = "sk-overlay";
      overlay.innerHTML = `<div class="sk-panel" id="sk-panel"></div>`;
      document.body.appendChild(overlay);
      overlay.addEventListener("click", e=>{ if(e.target===overlay) close(); });
      document.addEventListener("keydown", e=>{ if(e.key==="Escape" && overlay.classList.contains("open")) close(); });
    }

    const url = opts.url || location.href;
    const data = opts.data || null;
    const member = opts.member || null;
    const modes = [];
    if(member) modes.push({key:"member", label:`${member.name} 대표 공유`});
    modes.push({key:"chapter", label:"챕터 전체 공유"});
    const mode = opts.mode || (member?"member":"chapter");
    _ctx = { mode, member, data, url, modes };
    if(mode === "chapter"){ _ctx.url = opts.chapterUrl || (location.origin + location.pathname.replace(/member\.html.*$/,"")); }

    document.getElementById("sk-panel").innerHTML = buildHTML(_ctx);
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";

    wire();
    drawQR(_ctx.url);
  }

  function close(){
    const o = document.getElementById("sk-overlay"); if(!o) return;
    o.classList.remove("open"); document.body.style.overflow = "";
  }

  function wire(){
    document.getElementById("sk-close").addEventListener("click", close);
    const url = _ctx.url;
    const previewTitle = _ctx.mode === "member"
      ? `${_ctx.member?.name||""} 대표 · ${_ctx.member?.company||""} · BNI 서초 메이저`
      : "BNI 서초 메이저 챕터 · 멤버 PR";

    document.getElementById("sk-copy-url").addEventListener("click", ()=>{
      navigator.clipboard.writeText(url).then(()=>toast("링크가 복사되었습니다"));
    });

    document.querySelectorAll("[data-share]").forEach(b=>{
      b.addEventListener("click", ()=>shareTo(b.dataset.share, url, previewTitle));
    });

    document.querySelectorAll("[data-copy-tpl]").forEach(b=>{
      b.addEventListener("click", ()=>{
        const i = +b.dataset.copyTpl;
        const tpls = buildTemplates(_ctx);
        navigator.clipboard.writeText(tpls[i].body).then(()=>toast(`'${tpls[i].name}' 메시지가 복사되었습니다`));
      });
    });

    document.querySelectorAll(".sk-tab").forEach(t=>{
      t.addEventListener("click", ()=>{
        const newMode = t.dataset.mode;
        if(newMode === _ctx.mode) return;
        _ctx.mode = newMode;
        if(newMode === "chapter"){
          _ctx.url = location.origin + location.pathname.replace(/member\.html.*$/,"");
        } else if(newMode === "member" && _ctx.member){
          _ctx.url = location.origin + location.pathname.replace(/[^/]*$/,"") + "member.html?id="+_ctx.member.id;
        }
        document.getElementById("sk-panel").innerHTML = buildHTML(_ctx);
        wire();
        drawQR(_ctx.url);
      });
    });

    document.getElementById("sk-qr-download").addEventListener("click", ()=>{
      const c = document.getElementById("sk-qr");
      if(!c) return;
      const a = document.createElement("a");
      a.href = c.toDataURL("image/png");
      const safe = (_ctx.member?.name||"chapter").replace(/[^\w가-힣]/g,"-");
      a.download = `bni-major-${safe}-qr.png`;
      a.click();
    });
  }

  function drawQR(url){
    const cv = document.getElementById("sk-qr");
    if(!cv || !window.QRCode) return;
    QRCode.toCanvas(cv, url, {margin:1,width:280,color:{dark:"#0E1F5C",light:"#FFFFFF"}}, ()=>{});
  }

  window.ShareKit = { open, close };
})();
