function CustomSelect(selector, config) {

  if (selector.tagName !== "SELECT") {
    selector.forEach((element) => {
      new CustomSelect(element);
    });
    return;
  }

  let target = selector;

  this._firstRender = false;

  // this._originSelectNode = target;

  this._parentNode = document.createElement("div");
  this._parentNode.classList.add("custom-select__wrapper");

  this._inputValueNode = document.createElement("div");
  this._inputValueNode.classList.add("custom-select__value", config.labelClass || '');

  this._initSelectConfig = (select) => {
    let _initConfig = {
      multiple: select.getAttribute("multiple") !== null,
      labelWidthImage: select.getAttribute("label-with-image") !== null,
      placeholder: select.getAttribute("placeholder"),
    };

    return _initConfig;
  };
  this.config = { ...this._initSelectConfig(target), ...config };

  this.selected = this.config.multiple ? [] : null;

  this._findOptionNode = () => {
    this.options = [];

    let _childNodes = target.children;

    for (let index = 0; index < _childNodes.length; index++) {
      let childNode = _childNodes[index];

      if (childNode.tagName.match(/^option$/gi)) {
        this.options.push({
          value: childNode.getAttribute("value"),
          label: childNode.innerText,
          image: childNode.getAttribute("data-image"),
        });
      } else {
        let _groups = {
          type: "group",
          label: childNode.getAttribute("label"),
          options: [],
        };

        let _optionNodes = childNode.querySelectorAll("option");

        _optionNodes.forEach((optionNode) => {
          _groups.options.push({
            value: optionNode.getAttribute("value"),
            label: optionNode.innerText,
            image: optionNode.getAttribute("data-image"),
          });
        });

        this.options.push(_groups);
      }
    }
  };

  this._listenOnFocusSelect = (event) => {
    event.stopPropagation();

    let isFocus = this._parentNode.classList.contains("focus");

    document.body.click();

    if (!isFocus) {
      this._parentNode.classList.toggle("focus");
    }
  };

  this._stopListenOnFocusSelect = (event) => {
    event.stopPropagation();
    this._parentNode.classList.remove("focus");
  };

  this._initializeSelectNode = () => {
    if (!this._firstRender) {
      target.parentNode.insertBefore(this._parentNode, target);
      this._parentNode.appendChild(target);

      this._inputValueNode.innerHTML = this.config.placeholder
        ? this.config.placeholder
        : "&nbsp;";

      this._inputValueNode.addEventListener(
        "click",
        this._listenOnFocusSelect
      );

      document.addEventListener("click", this._stopListenOnFocusSelect);

      this._parentNode.appendChild(this._inputValueNode);

      this._firstRender = true;
    }
  };

  this._renderHtmlStringFromObject = (obj) => {
    if (obj.hasOwnProperty("type") && obj.type === "group") {
      let _optionChildHtmlString = obj.options.reduce(
        (__htmlString, __option) =>
          `${__htmlString}${this._renderHtmlStringFromObject(
            __option
          )}`,
        ""
      );

      let _htmlString = `
              <div class='custom-select__optgroup'>
                <div class='custom-select-optgroup__label'>${obj.label}</div>
                ${_optionChildHtmlString}
              </div>
        `;

      return _htmlString;
    } else {
      return `
          <div class='custom-select__option' data-value='${obj.value}'>
            ${
        this.config.labelWidthImage
          ? `<span class='custom-select__label-image' style='background-image: url(${
          obj.image || ""
          })' ></span>`
          : ""
        } 
            ${obj.label}
          </div>
        `;
    }
  };

  this._updateMultipleValue = (arr, value) => {
    for (let index = 0; index < arr.length; index++) {
      if (arr[index] === value) {
        return arr.filter((it) => it !== value);
      }
    }
    return [...arr, value];
  };

  this._changeSelectValue = (value, label) => {
    let _findOptionByValueAndLabel;

    for (let index = 0; index < this.options.length; index++) {
      const currentInArr = this.options[index];
      if (
        currentInArr.hasOwnProperty("type") &&
        currentInArr.type === "group"
      ) {
        _findOptionByValueAndLabel = currentInArr.options.find(
          (it) => it.value === value
        );
        if (_findOptionByValueAndLabel) break;
      } else {
        if (currentInArr.value === value) {
          _findOptionByValueAndLabel = currentInArr;
          break;
        }
      }
    }

    this.selected = this.config.multiple
      ? this._updateMultipleValue(
        this.selected,
        _findOptionByValueAndLabel
      )
      : _findOptionByValueAndLabel;

    this.setValue(Array.isArray(this.selected) ? this.selected.map(it => it.value) : this.selected.value);

    this._updateLabel()
  };

  this._updateLabel = () => {
    if ((this.config.multiple && this.selected.length === 0) || !this.selected) {
      this._inputValueNode.innerHTML =
        this.config.placeholder || "&nbsp;";
      return;
    }

    this._inputValueNode.innerHTML = this.config.hasOwnProperty(
      "templateLabel"
    )
      ? this.config.templateLabel(
        this.selected.label || this.selected.map((it) => it.label)
      )
      : this.config.multiple
        ? this.selected.map((it) => it.label)
        : this.selected.label;
  }

  this.setValue = (value, isOnlyUpdateSelectNode = true) => {
    const _self = this;

      target.querySelectorAll(`option`).forEach(_optionNode => {
        if((Array.isArray(value) && value.indexOf(_optionNode.value) > -1) || (value === _optionNode.value)){
          _optionNode.selected = true;
          !isOnlyUpdateSelectNode && _self._parentNode.querySelector(`.custom-select__option[data-value='${_optionNode.value}']`).classList.add('selected')
        
        }else{
          _optionNode.selected = true;
          !isOnlyUpdateSelectNode && _self._parentNode.querySelector(`.custom-select__option[data-value='${_optionNode.value}']`).classList.remove('selected')
        
        }
      })

    if (!isOnlyUpdateSelectNode) {
      if (this.config.multiple) {
        this.selected = this.options.reduce((_selected, _option) => {
          return value.indexOf(_option.value) > -1 ? [..._selected, _option] : _selected
        }, [])
        console.log(this.selected)

      } else {
        this.selected = this.options.find(_option => _option.value === value)
      }

      this._updateLabel()
    }

  }

  this.getValue = () => this.selected ? Array.isArray(this.selected) ? this.selected.map(it => it.value) : this.selected.value : null

  this._resetAndUpdateSelectedOption = (_optionIsSelected) => {
    if (!this.config.multiple) {
      this._parentNode
        .querySelectorAll(".custom-select__option")
        .forEach((_optionNode) => {
          _optionNode.classList.remove("selected");
        });

      _optionIsSelected.classList.add("selected");
    } else {
      _optionIsSelected.classList.toggle("selected");
    }
  };

  this._listenOnOptionClicked = (event) => {
    event.stopPropagation();

    let value = event.target.getAttribute("data-value"),
      text = event.target.innerText;

    this._resetAndUpdateSelectedOption(event.target);

    if (value && text) {
      this._changeSelectValue(value, text);
    }
  };

  this._renderSelection = () => {
    let _selectionNode = this._parentNode.querySelector(
      ".custom-select__selections"
    );

    let _htmlString = this.options.reduce(
      (_string, _option) =>
        _string + this._renderHtmlStringFromObject(_option),
      ""
    );

    if (!_selectionNode) {
      _selectionNode = document.createElement("div");
      _selectionNode.className = "custom-select__selections";
      _selectionNode.innerHTML = _htmlString;
      this._parentNode.appendChild(_selectionNode);
    } else {
      _selectionNode.innerHTML = _htmlString;
    }

    this._parentNode
      .querySelectorAll(".custom-select__option")
      .forEach((_selector) => {
        _selector.addEventListener(
          "click",
          this._listenOnOptionClicked
        );
      });
  };

  this._init = () => {

    if (target.style.setProperty) {
      target.style.setProperty("display", "none", "important");
    } else {
      target.style.setAttribute("display", "none");
    }
    this._findOptionNode();
    this._initializeSelectNode();

    this._renderSelection();

    target.addEventListener('change', this.onTargetChangeListener)

  };

  this.refresh = this._init;

  this._init();
}