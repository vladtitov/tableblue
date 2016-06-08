/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
var upload;
(function (upload) {
    var R_C = (function () {
        function R_C($view) {
            this.$texts = this.createCollection('data-text', $view);
            this.$visible = this.createCollection('data-vis', $view);
            this.$imgs = this.createCollection('data-img', $view);
            this.$chk = this.createCollection('data-chk', $view);
        }
        R_C.prototype.createCollection = function (type, $view) {
            var obj = {};
            $view.find('[' + type + ']').each(function (i, el) {
                obj[String(el.getAttribute(type))] = $(el);
            });
            return obj;
        };
        R_C.prototype.getObject = function (str) {
            return this.$texts[str] || this.$visible[str] || this.$imgs[str] || this.$chk[str];
        };
        R_C.prototype.getData = function () {
            var item = {};
            for (var str in this.$texts)
                item[str] = this.$texts[str].text();
            // for (var str in this.$visible)item[str] = this.$visible[str].visible();
            for (var str in this.$imgs)
                item[str] = this.item[str];
            for (var str in this.$chk)
                item[str] = this.$chk[str].prop('checked');
            return item;
        };
        R_C.prototype.setData = function (item) {
            //  console.log(item);
            this.item = item;
            for (var str in this.$texts)
                this.$texts[str].text(item[str]);
            //for (var str in this.$visible)item[str] ? this.$visible[str].show() : this.$visible[str].hide();
            for (var str in this.$imgs)
                this.$imgs[str].css('background-image', 'url(' + item[str] + ')');
            for (var str in this.$chk)
                this.$chk[str].prop('checked', item[str]);
        };
        return R_C;
    }());
    var ListItem5 = (function () {
        function ListItem5(item, template) {
            var _this = this;
            this.current = '';
            this.timer = 0;
            this.id = item.id;
            this.$view = $(template);
            this.rc = new R_C(this.$view);
            this.setData(item);
            this.$view.click(function () { ListItem5.onSelect(_this); });
        }
        ListItem5.prototype.setData = function (item) {
            this.rc.setData(item);
        };
        ListItem5.prototype.getDaata = function () {
            return this.rc.getData();
        };
        ListItem5.prototype.appendTo = function ($cont) {
            $cont.append(this.$view);
        };
        ListItem5.prototype.remove = function () {
            var _this = this;
            this.$view.fadeOut(function () {
                _this.$view.remove();
            });
        };
        ListItem5.onSelect = function (itrm) {
        };
        return ListItem5;
    }());
    var ListUpload = (function () {
        function ListUpload(listid, options) {
            this.listid = listid;
            this.options = options;
            this.getparams = '2016-03-15T7:58:34';
            this.postparams = '';
            this.saveurl = '';
            for (var str in options)
                this[str] = options[str];
        }
        ListUpload.prototype.init = function () {
            var _this = this;
            this.$view = $(this.listid);
            this.$tbody = this.$view.find('[data-id=list]:first');
            this.$nano = this.$view.find('.nano:first');
            this.template = this.$view.find('[data-id=template]').html();
            ListItem5.onSelect = function (item) {
                //  console.log(item);
                if (_this.selected)
                    _this.selected.$view.removeClass('selected');
                _this.selected = item;
                _this.selected.$view.addClass('selected');
            };
            if (this.btnUpload)
                $(this.listid + ' ' + this.btnUpload).change(function (evt) { return _this.uploadFile(evt); });
            if (this.btnDelete)
                $(this.listid + ' ' + this.btnDelete).click(function (evt) { return _this.deleteFile(evt); });
            if (this.btnEdit)
                $(this.listid + ' ' + this.btnEdit).click(function (evt) { return _this.openEditPanel(evt); });
        };
        ListUpload.prototype.getSelected = function () {
            return this.selected ? this.selected.getDaata() : 0;
        };
        ListUpload.prototype.loadData = function (params) {
            var _this = this;
            if (params)
                this.getparams = params;
            $.get(this.serviceUrl + this.getparams).done(function (data) {
                _this.onData(data);
            }).fail(function (reason) {
                console.log(reason);
            });
        };
        ListUpload.prototype.setData = function (data) {
            var out = [];
            var ar = data;
            this.$tbody.empty();
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = new ListItem5(ar[i], this.template);
                item.appendTo(this.$tbody);
                out.push(item);
            }
            this.data = out;
            this.selected = null;
            if (this.$nano.length)
                this.$nano.nanoScroller();
        };
        ListUpload.prototype.getData = function () {
            var out = [];
            var ar = this.data;
            for (var i = 0, n = ar.length; i < n; i++) {
                out.push(ar[i].getDaata());
            }
            return out;
        };
        ListUpload.prototype.initEditPanel = function () {
            var _this = this;
            this.$editPanel = $(this.listid + ' [data-id=editpanel]:first');
            // console.log(  this.$editPanel);
            this.$editImasge = this.$editPanel.find('[data-img=icon]');
            this.$editInput = this.$editPanel.find('[data-text=filename]');
            this.$editPanel.find('[data-id=close]').click(function () { _this.$editPanel.fadeOut(); });
            this.$editPanel.find('[data-id=save]:first').click(function () { return _this.saveEditImage(); });
            this.$editPanel.find('[data-id=reupload]:first').change(function (evt) { return _this.reuploadImage(evt); });
        };
        ListUpload.prototype.reuploadImage = function (evt) {
            var _this = this;
            console.log('reupload');
            var filename = this.$editInput.val();
            var input = evt.target;
            var file = input.files[0];
            var form = new FormData();
            form.append('file', file);
            $.ajax({
                url: this.serviceUrl + 'a=upload',
                type: 'POST',
                dataType: 'json',
                data: form,
                cache: false,
                contentType: false,
                processData: false
            }).done(function (res) {
                console.log(res);
                if (res.error) {
                    alert(res.error);
                    return;
                }
                _this.$editImasge.attr('src', res.result);
                _this.$editImasge.data('newimg', res.filename);
                // this.$editPanel.fadeOut();
                _this.loadData();
            }).fail(function (res) {
                console.log('fail', res);
            });
        };
        ListUpload.prototype.saveEditImage = function () {
            var _this = this;
            var input = this.$editInput;
            var oldname = input.data('oldname');
            var newname = input.val();
            var newimg = this.$editImasge.data('newimg');
            if (newimg)
                oldname = newimg;
            var out = { oldname: oldname, newname: newname };
            $.post(this.serviceUrl + 'a=rename', JSON.stringify(out)).done(function (res) {
                if (res.error) {
                    alert(res.error);
                    return;
                }
                console.log(res);
                if (res.success) {
                    if (res.replaced)
                        _this.newimage = res.newname;
                    else
                        _this.newimage = null;
                    _this.$editPanel.fadeOut();
                    _this.loadData();
                }
                else if (res.error)
                    alert(res.error);
            }).fail(function (err) { console.log(err); });
        };
        ListUpload.prototype.openEditPanel = function (evt) {
            var sel = this.getSelected();
            if (!sel)
                return;
            console.log(sel);
            if (!this.$editPanel)
                this.initEditPanel();
            this.$editImasge.attr('src', sel.icon);
            this.$editImasge.data('oldimg', sel.icon);
            this.$editImasge.data('newimg', null);
            //  $(this.listid+' '+this.btnUpload).val('');
            this.$editInput.data('oldname', sel.filename).val(sel.filename);
            this.$editPanel.show();
        };
        ListUpload.prototype.uploadFile = function (evt) {
            var _this = this;
            var input = evt.target;
            var file = input.files[0];
            var form = new FormData();
            form.append('file', file);
            $.ajax({
                url: this.serviceUrl + 'a=upload',
                type: 'POST',
                dataType: 'json',
                data: form,
                cache: false,
                contentType: false,
                processData: false
            }).done(function (res) {
                console.log(res);
                if (res.error)
                    alert(res.error);
                else
                    _this.loadData();
            }).fail(function (res) {
                console.log('fail', res);
            });
        };
        ListUpload.prototype.deleteFile = function (evt) {
            var _this = this;
            var sel = this.getSelected();
            if (!sel)
                return;
            var filename = sel.filename;
            var conf = confirm('You want to delete ' + filename);
            if (conf) {
                $.get(this.serviceUrl + 'a=delete&filename=' + filename).done(function (res) {
                    _this.loadData();
                    console.log(res);
                }).fail(function () {
                    _this.loadData();
                });
            }
        };
        ListUpload.prototype.saveData = function (data) {
            var out = {};
            out.data = data;
            console.log(data);
            var user = {};
            user.user = this.$view.find('[data-id=user]:first').val();
            user.pass = this.$view.find('[data-id=pass]:first').val();
            out.user = user;
            var url = this.saveurl + this.postparams;
            console.log(url);
            $.post(url, JSON.stringify(out)).done(function (res) {
                console.log(res);
                if (res.result == 'SAVED')
                    alert('Data saved on server');
                else
                    alert('Error ' + res.result);
            }).fail(function (fail) {
                console.log(fail);
                alert('Error ' + fail);
            });
        };
        return ListUpload;
    }());
    upload.ListUpload = ListUpload;
})(upload || (upload = {}));
//# sourceMappingURL=AssetsManagerOld.js.map