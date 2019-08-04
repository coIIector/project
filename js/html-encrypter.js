(function ($) {
    let $body = null;

    function doInit() {
        window.htmlEncrypter.onInit = function (f) {
            f($);
        };
        window.htmlEncrypter._onInitArr.forEach(window.htmlEncrypter.onInit);
        delete window.htmlEncrypter._onInitArr;
    }

    function preventInit() {
        window.htmlEncrypter.onInit = $.noop;
        delete window.htmlEncrypter._onInitArr;
    }

    $(function () {
        const $encrypted = $('#encrypted');
        const $decrypted = $('#decrypted');
        $body = $(document.body);

        if ($encrypted.length === 1) {
            decrypt($encrypted);
        } else if ($decrypted.length === 1) {
            encrypt($decrypted);
        }

        if (Math.min(screen.width, screen.height) >= 768)
            location.hash = '';
    });

    function decrypt($container) {
        const searchParams = new URL(location.href).searchParams;
        const password = window.htmlEncrypter.hashPassword || prompt("Decrypt with password...");

        if (!password)
            return preventInit();

        new Promise(function (resolve, reject) {
            const text = $container.text();
            $container.remove();

            if (text.trim() !== "")
                return resolve(text);

            const jsonUrl = searchParams.get("json");
            if (!jsonUrl)
                return reject("Nothing to decode...");

            $.get(jsonUrl, function (data) {
                if (data && data.trim && data.trim() !== "") {
                    resolve(data);
                } else {
                    reject(`Empty file at: ${jsonUrl}`);
                }
            }).fail(function () {
                reject(`Data not found: ${jsonUrl}`);
            });
        }).then(function (text) {
            const decrypted = sjcl.decrypt(password, text);
            $body.append($('<div/>', {id: 'decrypted', html: decrypted}));
            doInit();
        }).catch(function (error) {
            if (error && error.message && error.message === "ccm: tag doesn't match") {
                error = 'Invalid password';
            }

            $body.text(error || "Unknown error.");
            preventInit();
        });
    }

    function encrypt($container) {
        const password = window.htmlEncrypter.hashPassword || prompt("Encrypt with password");
        if (!password) {
            return doInit();
        }

        const html = $container.html();
        $container.remove();
        const encrypted = sjcl.encrypt(password, html);
        $body.append($('<div/>', {id: 'encrypted', text: encrypted}));
        return preventInit();
    }
})(jQuery);