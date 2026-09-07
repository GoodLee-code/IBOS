(function (window, document) {
  "use strict";

  var documentation = window.pageDocumentation || {};
  var documentationNote = window.pageDocumentationNote;
  var layout = document.querySelector(".layout");
  var activeField = null;
  var highlightTimer = null;

  if (!layout || !Object.keys(documentation).length) {
    return;
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (typeof text === "string") {
      element.textContent = text;
    }
    return element;
  }

  function getActivePage() {
    return document.querySelector(".page-view.active");
  }

  function getActivePageName() {
    var activePage = getActivePage();
    return activePage ? activePage.dataset.view || "" : "";
  }

  var trigger = createElement("button", "page-doc-trigger", "页面说明");
  trigger.type = "button";
  trigger.setAttribute("aria-controls", "pageDocumentationDrawer");
  trigger.setAttribute("aria-expanded", "false");

  var drawer = createElement("aside", "page-doc-drawer");
  drawer.id = "pageDocumentationDrawer";
  drawer.setAttribute("aria-label", "页面说明");
  drawer.setAttribute("aria-hidden", "true");
  drawer.setAttribute("inert", "");

  var drawerInner = createElement("div", "page-doc-drawer-inner");
  var header = createElement("header", "page-doc-header");
  var heading = createElement("div", "page-doc-heading");
  var title = createElement("h2", "page-doc-title", "页面说明");
  var pageName = createElement("div", "page-doc-page-name");
  var closeButton = createElement("button", "page-doc-close", "×");
  var body = createElement("div", "page-doc-body");
  var message = createElement("div", "page-doc-message");

  title.id = "pageDocumentationTitle";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "关闭页面说明");
  drawer.setAttribute("aria-labelledby", title.id);
  drawerInner.appendChild(header);
  drawerInner.appendChild(message);
  drawerInner.appendChild(body);
  heading.appendChild(title);
  heading.appendChild(pageName);
  header.appendChild(heading);
  header.appendChild(closeButton);
  drawer.appendChild(drawerInner);
  layout.appendChild(trigger);
  layout.appendChild(drawer);

  function renderSimpleList(section, items) {
    if (!items || !items.length) {
      return;
    }
    var list = createElement("ul", "page-doc-list");
    items.forEach(function (item) {
      var listItem = createElement("li", "page-doc-list-item");
      var titleRow = createElement("div", "page-doc-item-title-row");
      titleRow.appendChild(createElement("span", "page-doc-item-title", item.title));
      if (item.status === "pending") {
        titleRow.appendChild(createElement("span", "page-doc-pending", "待补充"));
      }
      listItem.appendChild(titleRow);
      listItem.appendChild(createElement("div", "page-doc-item-description", item.description));
      list.appendChild(listItem);
    });
    section.appendChild(list);
  }

  function findFieldTarget(fieldId) {
    var activePage = getActivePage();
    if (!activePage) {
      return null;
    }
    var targets = Array.prototype.filter.call(activePage.querySelectorAll("[data-doc-field]"), function (element) {
      return element.dataset.docField === fieldId;
    });
    return targets.find(function (element) {
      return element.getClientRects().length > 0;
    }) || targets[0] || null;
  }

  function focusField(fieldId, fieldName) {
    var target = findFieldTarget(fieldId);
    if (!target || target.getClientRects().length === 0) {
      message.textContent = "当前视图未展示“" + fieldName + "”字段";
      return;
    }
    message.textContent = "已定位到“" + fieldName + "”";
    if (activeField) {
      activeField.classList.remove("page-doc-field-highlight");
    }
    window.clearTimeout(highlightTimer);
    activeField = target;
    target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    target.classList.add("page-doc-field-highlight");
    highlightTimer = window.setTimeout(function () {
      target.classList.remove("page-doc-field-highlight");
      if (activeField === target) {
        activeField = null;
      }
    }, 2000);
  }

  function appendSection(sectionTitle) {
    var section = createElement("section", "page-doc-section");
    section.appendChild(createElement("h3", "page-doc-section-title", sectionTitle));
    body.appendChild(section);
    return section;
  }

  function renderDocumentationNote() {
    if (!documentationNote || (!documentationNote.text && !documentationNote.code)) {
      return;
    }
    var note = createElement("div", "page-doc-note");
    if (documentationNote.label) {
      note.appendChild(createElement("span", "page-doc-note-label", documentationNote.label + "："));
    }
    if (documentationNote.text) {
      note.appendChild(createElement("span", "page-doc-note-text", documentationNote.text));
    }
    if (documentationNote.code) {
      note.appendChild(createElement("code", "page-doc-note-code", documentationNote.code));
    }
    body.appendChild(note);
  }

  function renderDocumentation() {
    var currentPageName = getActivePageName();
    var config = documentation[currentPageName];
    trigger.hidden = !config;
    if (!config) {
      setOpen(false);
      return;
    }

    var pageConfig = config.page || {};
    var fields = config.fields || [];
    var functions = config.functions || [];
    var businessRules = config.businessRules || [];
    var interactions = config.interactions || [];

    pageName.textContent = pageConfig.title || currentPageName;
    body.textContent = "";
    message.textContent = "";

    renderDocumentationNote();

    if (pageConfig.description) {
      var pageSection = appendSection("页面说明");
      pageSection.appendChild(createElement("p", "page-doc-summary", pageConfig.description));
    }

    if (fields.length) {
      var fieldSection = appendSection("字段说明");
      var fieldList = createElement("div", "page-doc-list");
      fields.forEach(function (field) {
        var fieldButton = createElement("button", "page-doc-field-link");
        fieldButton.type = "button";
        fieldButton.dataset.docFieldTarget = field.id;
        fieldButton.appendChild(createElement("span", "page-doc-field-name", field.name));
        fieldButton.appendChild(createElement("span", "page-doc-field-description", field.description));
        fieldButton.addEventListener("click", function () {
          focusField(field.id, field.name);
        });
        fieldList.appendChild(fieldButton);
      });
      fieldSection.appendChild(fieldList);
    }

    if (functions.length) {
      renderSimpleList(appendSection("功能逻辑"), functions);
    }
    if (businessRules.length) {
      renderSimpleList(appendSection("业务规则"), businessRules);
    }
    if (interactions.length) {
      renderSimpleList(appendSection("交互说明"), interactions);
    }
  }

  function setOpen(willOpen) {
    layout.classList.toggle("page-doc-open", willOpen);
    trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
    drawer.setAttribute("aria-hidden", willOpen ? "false" : "true");
    drawer.inert = !willOpen;
    if (willOpen) {
      renderDocumentation();
      window.setTimeout(function () { closeButton.focus(); }, 0);
    } else {
      message.textContent = "";
      trigger.focus({ preventScroll: true });
    }
  }

  trigger.addEventListener("click", function () {
    setOpen(true);
  });

  closeButton.addEventListener("click", function () {
    setOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && layout.classList.contains("page-doc-open")) {
      setOpen(false);
    }
  });

  var pageObserver = new MutationObserver(function (mutations) {
    if (mutations.some(function (mutation) { return mutation.attributeName === "class"; })) {
      renderDocumentation();
    }
  });
  document.querySelectorAll(".page-view").forEach(function (page) {
    pageObserver.observe(page, { attributes: true, attributeFilter: ["class"] });
  });

  renderDocumentation();
})(window, document);
