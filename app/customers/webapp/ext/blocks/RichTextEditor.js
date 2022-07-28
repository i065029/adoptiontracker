/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/buildingBlocks/BuildingBlock", "sap/ui/richtexteditor/RichTextEditor", "sap/fe/core/helpers/ClassSupport", "sap/m/FormattedText", "sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/helpers/BindingToolkit", "sap/ui/core/InvisibleText", "sap/m/VBox", "sap/fe/core/jsx-runtime/jsx", "sap/fe/core/jsx-runtime/jsxs", "sap/fe/core/jsx-runtime/Fragment"], function (BuildingBlock, RTEControl, ClassSupport, FormattedText, BindingHelper, BindingToolkit, InvisibleText, VBox, _jsx, _jsxs, _Fragment) {
    "use strict";

    var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;

    var _exports = {};
    var not = BindingToolkit.not;
    var UI = BindingHelper.UI;
    var defineReference = ClassSupport.defineReference;
    var xmlAttribute = BuildingBlock.xmlAttribute;
    var defineBuildingBlock = BuildingBlock.defineBuildingBlock;
    var BuildingBlockBase = BuildingBlock.BuildingBlockBase;

    function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

    function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

    function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

    var RichTextEditor = (_dec = defineBuildingBlock({
        name: 'RichTextEditor',
        namespace: 'sap.fe.blocks.richtexteditor',
        isRuntime: true
    }), _dec2 = xmlAttribute({
        type: 'string'
    }), _dec3 = defineReference(), _dec4 = defineReference(), _dec(_class = (_class2 = /*#__PURE__*/function (_BuildingBlockBase) {
        _inheritsLoose(RichTextEditor, _BuildingBlockBase);

        function RichTextEditor(properties) {
            var _this;

            _this = _BuildingBlockBase.call(this, properties) || this;

            _initializerDefineProperty(_this, "value", _descriptor, _assertThisInitialized(_this));

            _initializerDefineProperty(_this, "richTextEditor", _descriptor2, _assertThisInitialized(_this));

            _initializerDefineProperty(_this, "bindingHolder", _descriptor3, _assertThisInitialized(_this));

            _this.onBindingChange = function (_bindingChangeEvent) {
                if (_this.bindingHolder.current && _this.richTextEditor.current && _this.bindingHolder.current.getBinding('text')) {
                    _this.bindingHolder.current.getBinding('text').attachChange(function () {
                        if (_this.bindingHolder.current && _this.richTextEditor.current) {
                            _this.richTextEditor.current.setValue(_this.bindingHolder.current.getText());
                        }
                    });
                }
            };

            _this.onRTEReady = function () {
                _this.rteReady = true;

                _this.onBindingChange();
            };

            _this.onRTEChange = function (_rteChangeEvent) {
                if (_this.bindingHolder.current && _this.richTextEditor.current && _this.bindingHolder.current.getBinding('text')) {
                    _this.bindingHolder.current.setText(_this.richTextEditor.current.getValue());
                }
            };

            return _this;
        }

        _exports = RichTextEditor;
        var _proto = RichTextEditor.prototype;

        _proto.render = function render() {
            return _jsx(_Fragment, {
                children: _jsxs(VBox, {
                    width: '100%',
                    children: [_jsx(FormattedText, {
                        htmlText: this.value,
                        visible: not(UI.IsEditable)
                    }), _jsx(RTEControl, {
                        ref: this.richTextEditor,
                        visible: UI.IsEditable,
                        change: this.onRTEChange,
                        ready: this.onRTEReady,
                        customToolbar: true,
                        editable: true,
                        showGroupFontStyle: true,
                        showGroupTextAlign: true,
                        showGroupStructure: true,
                        showGroupFont: true,
                        showGroupClipboard: false,
                        showGroupInsert: true,
                        showGroupLink: true,
                        showGroupUndo: true,
                        sanitizeValue: true,
                        wrapping: true,
                        width: "100%"
                    }), _jsx(InvisibleText, {
                        ref: this.bindingHolder,
                        text: this.value,
                        modelContextChange: this.onBindingChange
                    })]
                })
            });
        };

        return RichTextEditor;
    }(BuildingBlockBase), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "value", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
    }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "richTextEditor", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
    }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bindingHolder", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
    })), _class2)) || _class);
    RichTextEditor.register();
    _exports = RichTextEditor;
    return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSaWNoVGV4dEVkaXRvciIsImRlZmluZUJ1aWxkaW5nQmxvY2siLCJuYW1lIiwibmFtZXNwYWNlIiwiaXNSdW50aW1lIiwieG1sQXR0cmlidXRlIiwidHlwZSIsImRlZmluZVJlZmVyZW5jZSIsInByb3BlcnRpZXMiLCJvbkJpbmRpbmdDaGFuZ2UiLCJfYmluZGluZ0NoYW5nZUV2ZW50IiwiYmluZGluZ0hvbGRlciIsImN1cnJlbnQiLCJyaWNoVGV4dEVkaXRvciIsImdldEJpbmRpbmciLCJhdHRhY2hDaGFuZ2UiLCJzZXRWYWx1ZSIsImdldFRleHQiLCJvblJURVJlYWR5IiwicnRlUmVhZHkiLCJvblJURUNoYW5nZSIsIl9ydGVDaGFuZ2VFdmVudCIsInNldFRleHQiLCJnZXRWYWx1ZSIsInJlbmRlciIsInZhbHVlIiwibm90IiwiVUkiLCJJc0VkaXRhYmxlIiwiQnVpbGRpbmdCbG9ja0Jhc2UiLCJyZWdpc3RlciJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiLi4vc3JjL1JpY2hUZXh0RWRpdG9yLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCdWlsZGluZ0Jsb2NrQmFzZSwgZGVmaW5lQnVpbGRpbmdCbG9jaywgeG1sQXR0cmlidXRlIH0gZnJvbSAnc2FwL2ZlL2NvcmUvYnVpbGRpbmdCbG9ja3MvQnVpbGRpbmdCbG9jayc7XG5pbXBvcnQgUlRFQ29udHJvbCBmcm9tICdzYXAvdWkvcmljaHRleHRlZGl0b3IvUmljaFRleHRFZGl0b3InO1xuaW1wb3J0IHsgZGVmaW5lUmVmZXJlbmNlIH0gZnJvbSAnc2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnQnO1xuaW1wb3J0IHR5cGUgeyBQcm9wZXJ0aWVzT2YgfSBmcm9tICdzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydCc7XG5pbXBvcnQgRm9ybWF0dGVkVGV4dCBmcm9tICdzYXAvbS9Gb3JtYXR0ZWRUZXh0JztcbmltcG9ydCB7IFVJIH0gZnJvbSAnc2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0JpbmRpbmdIZWxwZXInO1xuaW1wb3J0IHsgbm90IH0gZnJvbSAnc2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nVG9vbGtpdCc7XG5pbXBvcnQgdHlwZSB7IFByb3BlcnR5QmluZGluZ0luZm8gfSBmcm9tICdzYXAvdWkvYmFzZS9NYW5hZ2VkT2JqZWN0JztcbmltcG9ydCBJbnZpc2libGVUZXh0IGZyb20gJ3NhcC91aS9jb3JlL0ludmlzaWJsZVRleHQnO1xuaW1wb3J0IHR5cGUgeyBSZWYgfSBmcm9tICdzYXAvZmUvY29yZS9qc3gtcnVudGltZSc7XG5pbXBvcnQgdHlwZSBFdmVudCBmcm9tICdzYXAvdWkvYmFzZS9FdmVudCc7XG5pbXBvcnQgVkJveCBmcm9tICdzYXAvbS9WQm94JztcblxuQGRlZmluZUJ1aWxkaW5nQmxvY2soeyBuYW1lOiAnUmljaFRleHRFZGl0b3InLCBuYW1lc3BhY2U6ICdzYXAuZmUuYmxvY2tzLnJpY2h0ZXh0ZWRpdG9yJywgaXNSdW50aW1lOiB0cnVlIH0pXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSaWNoVGV4dEVkaXRvciBleHRlbmRzIEJ1aWxkaW5nQmxvY2tCYXNlIHtcbiAgICBAeG1sQXR0cmlidXRlKHsgdHlwZTogJ3N0cmluZycgfSlcbiAgICB2YWx1ZSE6IHN0cmluZztcblxuICAgIEBkZWZpbmVSZWZlcmVuY2UoKVxuICAgIHJpY2hUZXh0RWRpdG9yITogUmVmPFJURUNvbnRyb2w+O1xuXG4gICAgQGRlZmluZVJlZmVyZW5jZSgpXG4gICAgYmluZGluZ0hvbGRlciE6IFJlZjxJbnZpc2libGVUZXh0PjtcblxuICAgIHJ0ZVJlYWR5OiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6IFByb3BlcnRpZXNPZjxSaWNoVGV4dEVkaXRvcj4pIHtcbiAgICAgICAgc3VwZXIocHJvcGVydGllcyk7XG4gICAgfVxuICAgIG9uQmluZGluZ0NoYW5nZSA9IChfYmluZGluZ0NoYW5nZUV2ZW50PzogRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5iaW5kaW5nSG9sZGVyLmN1cnJlbnQgJiZcbiAgICAgICAgICAgIHRoaXMucmljaFRleHRFZGl0b3IuY3VycmVudCAmJlxuICAgICAgICAgICAgdGhpcy5iaW5kaW5nSG9sZGVyLmN1cnJlbnQuZ2V0QmluZGluZygndGV4dCcpXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5iaW5kaW5nSG9sZGVyLmN1cnJlbnQuZ2V0QmluZGluZygndGV4dCcpLmF0dGFjaENoYW5nZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmluZGluZ0hvbGRlci5jdXJyZW50ICYmIHRoaXMucmljaFRleHRFZGl0b3IuY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpY2hUZXh0RWRpdG9yLmN1cnJlbnQuc2V0VmFsdWUodGhpcy5iaW5kaW5nSG9sZGVyLmN1cnJlbnQuZ2V0VGV4dCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgb25SVEVSZWFkeSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5ydGVSZWFkeSA9IHRydWU7XG4gICAgICAgIHRoaXMub25CaW5kaW5nQ2hhbmdlKCk7XG4gICAgfVxuICAgIG9uUlRFQ2hhbmdlID0gKF9ydGVDaGFuZ2VFdmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5iaW5kaW5nSG9sZGVyLmN1cnJlbnQgJiZcbiAgICAgICAgICAgIHRoaXMucmljaFRleHRFZGl0b3IuY3VycmVudCAmJlxuICAgICAgICAgICAgdGhpcy5iaW5kaW5nSG9sZGVyLmN1cnJlbnQuZ2V0QmluZGluZygndGV4dCcpXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5iaW5kaW5nSG9sZGVyLmN1cnJlbnQuc2V0VGV4dCh0aGlzLnJpY2hUZXh0RWRpdG9yLmN1cnJlbnQuZ2V0VmFsdWUoKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPFZCb3ggd2lkdGg9eycxMDAlJ30+XG4gICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRUZXh0IGh0bWxUZXh0PXt0aGlzLnZhbHVlfSB2aXNpYmxlPXtub3QoVUkuSXNFZGl0YWJsZSkgYXMgUHJvcGVydHlCaW5kaW5nSW5mb30gLz5cblxuICAgICAgICAgICAgICAgICAgICA8UlRFQ29udHJvbFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmPXt0aGlzLnJpY2hUZXh0RWRpdG9yfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZT17VUkuSXNFZGl0YWJsZSBhcyBQcm9wZXJ0eUJpbmRpbmdJbmZvfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlPXt0aGlzLm9uUlRFQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZHk9e3RoaXMub25SVEVSZWFkeX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVRvb2xiYXI9e3RydWV9XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0YWJsZT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dHcm91cEZvbnRTdHlsZT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dHcm91cFRleHRBbGlnbj17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dHcm91cFN0cnVjdHVyZT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dHcm91cEZvbnQ9e3RydWV9XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93R3JvdXBDbGlwYm9hcmQ9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0dyb3VwSW5zZXJ0PXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0dyb3VwTGluaz17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dHcm91cFVuZG89e3RydWV9XG4gICAgICAgICAgICAgICAgICAgICAgICBzYW5pdGl6ZVZhbHVlPXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgd3JhcHBpbmc9e3RydWV9PlxuICAgICAgICAgICAgICAgICAgICA8L1JURUNvbnRyb2w+XG4gICAgICAgICAgICAgICAgICAgIDxJbnZpc2libGVUZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICByZWY9e3RoaXMuYmluZGluZ0hvbGRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9e3RoaXMudmFsdWV9XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbENvbnRleHRDaGFuZ2U9e3RoaXMub25CaW5kaW5nQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvVkJveD5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICApO1xuICAgIH1cbn1cblJpY2hUZXh0RWRpdG9yLnJlZ2lzdGVyKCk7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BY3FCQSxjLFdBRHBCQyxtQkFBbUIsQ0FBQztJQUFFQyxJQUFJLEVBQUUsZ0JBQVI7SUFBMEJDLFNBQVMsRUFBRSw4QkFBckM7SUFBcUVDLFNBQVMsRUFBRTtFQUFoRixDQUFELEMsVUFFZkMsWUFBWSxDQUFDO0lBQUVDLElBQUksRUFBRTtFQUFSLENBQUQsQyxVQUdaQyxlQUFlLEUsVUFHZkEsZUFBZSxFOzs7SUFJaEIsd0JBQVlDLFVBQVosRUFBc0Q7TUFBQTs7TUFDbEQsc0NBQU1BLFVBQU47O01BRGtEOztNQUFBOztNQUFBOztNQUFBLE1BR3REQyxlQUhzRCxHQUdwQyxVQUFDQyxtQkFBRCxFQUFpQztRQUMvQyxJQUNJLE1BQUtDLGFBQUwsQ0FBbUJDLE9BQW5CLElBQ0EsTUFBS0MsY0FBTCxDQUFvQkQsT0FEcEIsSUFFQSxNQUFLRCxhQUFMLENBQW1CQyxPQUFuQixDQUEyQkUsVUFBM0IsQ0FBc0MsTUFBdEMsQ0FISixFQUlFO1VBQ0UsTUFBS0gsYUFBTCxDQUFtQkMsT0FBbkIsQ0FBMkJFLFVBQTNCLENBQXNDLE1BQXRDLEVBQThDQyxZQUE5QyxDQUEyRCxZQUFNO1lBQzdELElBQUksTUFBS0osYUFBTCxDQUFtQkMsT0FBbkIsSUFBOEIsTUFBS0MsY0FBTCxDQUFvQkQsT0FBdEQsRUFBK0Q7Y0FDM0QsTUFBS0MsY0FBTCxDQUFvQkQsT0FBcEIsQ0FBNEJJLFFBQTVCLENBQXFDLE1BQUtMLGFBQUwsQ0FBbUJDLE9BQW5CLENBQTJCSyxPQUEzQixFQUFyQztZQUNIO1VBQ0osQ0FKRDtRQUtIO01BQ0osQ0FmcUQ7O01BQUEsTUFnQnREQyxVQWhCc0QsR0FnQnpDLFlBQU07UUFDZixNQUFLQyxRQUFMLEdBQWdCLElBQWhCOztRQUNBLE1BQUtWLGVBQUw7TUFDSCxDQW5CcUQ7O01BQUEsTUFvQnREVyxXQXBCc0QsR0FvQnhDLFVBQUNDLGVBQUQsRUFBNEI7UUFDdEMsSUFDSSxNQUFLVixhQUFMLENBQW1CQyxPQUFuQixJQUNBLE1BQUtDLGNBQUwsQ0FBb0JELE9BRHBCLElBRUEsTUFBS0QsYUFBTCxDQUFtQkMsT0FBbkIsQ0FBMkJFLFVBQTNCLENBQXNDLE1BQXRDLENBSEosRUFJRTtVQUNFLE1BQUtILGFBQUwsQ0FBbUJDLE9BQW5CLENBQTJCVSxPQUEzQixDQUFtQyxNQUFLVCxjQUFMLENBQW9CRCxPQUFwQixDQUE0QlcsUUFBNUIsRUFBbkM7UUFDSDtNQUNKLENBNUJxRDs7TUFBQTtJQUVyRDs7Ozs7V0EyQkRDLE0sR0FBQSxrQkFBUztNQUNMLE9BQ0k7UUFBQSxVQUNJLE1BQUMsSUFBRDtVQUFNLEtBQUssRUFBRSxNQUFiO1VBQUEsV0FDSSxLQUFDLGFBQUQ7WUFBZSxRQUFRLEVBQUUsS0FBS0MsS0FBOUI7WUFBcUMsT0FBTyxFQUFFQyxHQUFHLENBQUNDLEVBQUUsQ0FBQ0MsVUFBSjtVQUFqRCxFQURKLEVBR0ksS0FBQyxVQUFEO1lBQ0ksR0FBRyxFQUFFLEtBQUtmLGNBRGQ7WUFFSSxPQUFPLEVBQUVjLEVBQUUsQ0FBQ0MsVUFGaEI7WUFHSSxNQUFNLEVBQUUsS0FBS1IsV0FIakI7WUFJSSxLQUFLLEVBQUUsS0FBS0YsVUFKaEI7WUFLSSxhQUFhLEVBQUUsSUFMbkI7WUFNSSxRQUFRLEVBQUUsSUFOZDtZQU9JLGtCQUFrQixFQUFFLElBUHhCO1lBUUksa0JBQWtCLEVBQUUsSUFSeEI7WUFTSSxrQkFBa0IsRUFBRSxJQVR4QjtZQVVJLGFBQWEsRUFBRSxJQVZuQjtZQVdJLGtCQUFrQixFQUFFLEtBWHhCO1lBWUksZUFBZSxFQUFFLElBWnJCO1lBYUksYUFBYSxFQUFFLElBYm5CO1lBY0ksYUFBYSxFQUFFLElBZG5CO1lBZUksYUFBYSxFQUFFLElBZm5CO1lBZ0JJLFFBQVEsRUFBRTtVQWhCZCxFQUhKLEVBcUJJLEtBQUMsYUFBRDtZQUNJLEdBQUcsRUFBRSxLQUFLUCxhQURkO1lBRUksSUFBSSxFQUFFLEtBQUtjLEtBRmY7WUFHSSxrQkFBa0IsRUFBRSxLQUFLaEI7VUFIN0IsRUFyQko7UUFBQTtNQURKLEVBREo7SUErQkgsQzs7O0lBeEV1Q29CLGlCOzs7Ozs7Ozs7Ozs7Ozs7O0VBMEU1QzdCLGNBQWMsQ0FBQzhCLFFBQWYifQ==