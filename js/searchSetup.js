(function ($) {
    var JSONP_METHOD_NAME = 'loadFromJson';
    var prefix = 'search:', prefixLength = prefix.length, json;
    var $json, $import, $table, $prefix, $url, $add, $pretty, $jsonp, $external, $loadExternal;
    var actions = '<td><span data-action="delete" class="glyphicon glyphicon-trash"></span><span data-action="edit" class="glyphicon glyphicon-edit"></span><span data-action="prompt" class="glyphicon glyphicon-play"></span><span data-action="default" class="glyphicon glyphicon-asterisk"></span></td>';

    var localStorageWrapper = {
        getItem: function (key) {
            return localStorage.getItem(prefix + key);
        },
        setItem: function (key, value) {
            return localStorage.setItem(prefix + key, value);
        },
        each: function (f) {
            $.each(localStorage, function (key, value) {
                if (!key.indexOf(prefix)) {
                    f(key.slice(prefixLength), value);
                }
            });
        },
        clear: function () {
            $.each(localStorage, function (key) {
                if (!key.indexOf(prefix)) {
                    localStorage.removeItem(key);
                }
            });
        },
        removeItem: function (key) {
            return localStorage.removeItem(prefix + key);
        }
    };

    var def = localStorageWrapper.getItem('DEFAULT');
    var external = localStorageWrapper.getItem('EXTERNAL');
    reloadJson();

    $(function () {
        $json = $('#json');
        $import = $('#do-import');
        $table = $('#table');
        $url = $('[name=url]');
        $prefix = $('[name=prefix]');
        $add = $('#add');
        $pretty = $('[name=pretty]');
        $jsonp = $('[name=jsonp]');
        $external = $('[name=external]');
        $loadExternal = $('#load-external');

        $external.val(external);

        var prefix = window.location.hash.split(' ')[0].slice(1);
        if (prefix) {
            $prefix.val(prefix);
        }


        $import.on('click', importJson);
        $add.on('click', addEntry);
        $table.on('click', '[data-action=delete]', function () {
            localStorageWrapper.removeItem($(this).closest('tr').data('key'));
            reloadJson();
            updateTextArea();
            fillTable();
        });
        $table.on('click', '[data-action=edit]', function () {
            var $tr = $(this).closest('tr');
            $prefix.val($(this).closest('tr').data('key'));
            $url.val($tr.children().eq(1).text());
        });
        $table.on('click', '[data-action=prompt]', function () {
            var $tr = $(this).closest('tr');
            var arg = prompt("test this search engine");
            if (arg != null) {
                window.location = $tr.children().eq(1).text().replace(/\{ARG}/g, encodeURIComponent(arg));
            }
        });
        $table.on('click', '[data-action=default]', function () {
            var $tr = $(this).closest('tr');
            if ($tr.hasClass('default')) {
                def = null;
                localStorageWrapper.removeItem('DEFAULT');
            } else {
                def = $tr.children().eq(1).text();
                localStorageWrapper.setItem('DEFAULT', def);
            }

            reloadJson();
            updateTextArea();
            fillTable();
        });
        $pretty.on('change', function () {
            updateTextArea();
        });
        $jsonp.on('change', function () {
            updateTextArea();
        });

        $loadExternal.on('click', function () {
            external = $external.val();
            if (external) {
                $.getScript(external);
            } else {
                localStorageWrapper.setItem('EXTERNAL', external);
                reloadJson();
                updateTextArea();
            }
        });

        updateTextArea();
        fillTable();
    });

    function reloadJson() {
        json = {};
        localStorageWrapper.each(function (key, value) {
            json[key] = value;
        });
    }

    function importJson() {
        json = JSON.parse($json.val());
        localStorageWrapper.clear();
        def = null;
        forEachKey(function (key, value) {
            localStorageWrapper.setItem(key, value);
            if (key == 'DEFAULT') {
                def = value;
            }
        });
        fillTable();
    }

    function fillTable() {
        $table.find('tr').slice(1).remove();

        forEachKey(function (key, value) {
            if (key != 'DEFAULT' && key != 'EXTERNAL') {
                $table.append(
                    $('<tr/>').append(
                        $('<td/>').text(key)
                    ).append(
                        $('<td/>').text(value)
                    ).append(actions).attr('data-key', key).toggleClass('default', value == def)
                );
            }
        });

        $table.html($table.html().replace(/\{ARG}/g, '<span>{ARG}</span>'));
    }

    function forEachKey(f) {
        $.each(json, function (key, value) {
            f(key, value);
        });
    }

    function addEntry() {
        var url = $url.val().trim();
        var prefix = $prefix.val().trim();
        if (prefix && url.indexOf('{ARG}') != -1) {
            $url.val('');
            $prefix.val('');
            localStorageWrapper.setItem(prefix, url);
        }

        reloadJson();
        updateTextArea();
        fillTable();
    }

    function updateTextArea() {
        var val = JSON.stringify(json, null, $pretty.prop('checked') ? '\t' : '');
        if ($jsonp.prop('checked')) {
            val = JSONP_METHOD_NAME + '(' + val + ')';
        }
        $json.val(val);
    }

    window[JSONP_METHOD_NAME] = function (j) {
        $.extend(json, j, {'EXTERNAL': external});
        forEachKey(function (key, value) {
            localStorageWrapper.setItem(key, value);
            if (key == 'DEFAULT') {
                def = value;
            }
        });
        fillTable();
        updateTextArea();
    };
})(jQuery);