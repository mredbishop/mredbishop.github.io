var _a;
var time = 0;
var timeInterval;
var rightCount = 0;
var size = 2;
var random = function (from, toLessThan) {
    from = Math.ceil(from);
    toLessThan = Math.floor(toLessThan);
    return Math.floor(Math.random() * (toLessThan - from)) + from;
};
var newGrid = function () {
    var across = [];
    var down = [];
    var count = size;
    do {
        var index = random(0, across.length + 1);
        across.splice(index, 0, count);
    } while (--count);
    localStorage.setItem("across", JSON.stringify(across));
    count = size;
    do {
        var index = random(0, down.length + 1);
        down.splice(index, 0, count);
    } while (--count);
    localStorage.setItem("down", JSON.stringify(down));
    return { across: across, down: down };
};
var celebrating = false;
var checkAnswers = function (element, cancelEventOnImpossibleAnswer) {
    if (cancelEventOnImpossibleAnswer === void 0) { cancelEventOnImpossibleAnswer = false; }
    if (celebrating)
        return;
    var possibleAnswer = Number($(element).val());
    if (isNaN(possibleAnswer)) {
        if (cancelEventOnImpossibleAnswer)
            event === null || event === void 0 ? void 0 : event.preventDefault();
        return;
    }
    var parts = element.id.split(":");
    var a = Number(parts[0]);
    var b = Number(parts[1]);
    var answer = a * b;
    if (answer === possibleAnswer) {
        if (element.parentElement && $(element.parentElement).hasClass("wrong")) {
            $(element.parentElement)
                .removeClass("wrong")
                .addClass("right");
            rightCount++;
            var tabIndex = Number($(element).attr("tabindex")) + 1;
            $("[tabindex=" + tabIndex + "]").focus();
        }
    }
    else {
        if (element.parentElement && $(element.parentElement).hasClass("right")) {
            $(element.parentElement)
                .addClass("wrong")
                .removeClass("right");
            rightCount--;
        }
    }
    $(".right-count").text(rightCount);
    if (rightCount === size * size) {
        celebrating = true;
        clearInterval(timeInterval);
        $(".answer").attr("readonly", "readonly");
        $("body").fireworks({ width: "100vw", height: "100vh", opacity: 0.6, sound: true });
        $("body").fireworks({ width: "100vw", height: "100vh", opacity: 0.6, sound: true });
        $("body").fireworks({ width: "100vw", height: "100vh", opacity: 0.6, sound: true });
        $("body").fireworks({ width: "100vw", height: "100vh", opacity: 0.6, sound: true });
        setTimeout(function () { return $("body").fireworks({ destroy: true }); }, 10000);
    }
};
var attachClicks = function () {
    $(".answer").focus(function (event) {
        $(this)
            .parent()
            .children(".sum")
            .removeClass("hidden");
    });
    $(".answer").blur(function (event) {
        $(this)
            .parent()
            .children(".sum")
            .addClass("hidden");
        checkAnswers(this);
    });
    $(".answer").keyup(function (event) {
        checkAnswers(this, true);
    });
    $(".answer").keydown(function (event) {
        if (event.keyCode === 9)
            return;
        var cellIndex = $(this).parent()[0].cellIndex;
        switch (event.keyCode) {
            case 37:
                var left = $(this)
                    .parent()
                    .prev()
                    .children(".answer");
                if (left)
                    left.focus();
                break;
            case 38:
                var above = $($(this)
                    .parent()
                    .parent()
                    .prev()
                    .children()[cellIndex]).children(".answer");
                if (above)
                    above.focus();
                break;
            case 39:
                var right = $(this)
                    .parent()
                    .next()
                    .children(".answer");
                if (right)
                    right.focus();
                break;
            case 40:
                var below = $($(this)
                    .parent()
                    .parent()
                    .next()
                    .children()[cellIndex]).children(".answer");
                if (below)
                    below.focus();
                break;
            default:
                var length_1 = $(this).val().length;
                var numMin = length_1 ? 48 : 49;
                var numPadMin = length_1 ? 96 : 97;
                if (event.keyCode !== 46 && event.keyCode !== 8 && (event.keyCode < numMin || event.keyCode > 57) && (event.keyCode < numPadMin || event.keyCode > 105)) {
                    return event.preventDefault();
                }
                var value = (event.keyCode >= numMin && event.keyCode <= 57) || (event.keyCode >= numPadMin && event.keyCode <= 105) ? event.key : "";
                var textBox = this;
                if (textBox.selectionStart === null || textBox.selectionEnd === null || textBox.selectionStart === null)
                    return;
                var t = textBox.value.substr(textBox.selectionStart, textBox.selectionEnd - textBox.selectionStart);
                var currentValue = $(this).val().replace(t, "") || "";
                var possibleAnswer = Number(currentValue + value);
                if (isNaN(possibleAnswer))
                    return event.preventDefault();
                if (!t && value && possibleAnswer > size * size)
                    return event.preventDefault();
        }
    });
};
var renderGrid = function (across, down) {
    $(".grid").empty();
    var html = '<table class="table table-bordered"><thead><tr><th scope="col" class="timer"></th>';
    for (var _i = 0, across_1 = across; _i < across_1.length; _i++) {
        var num = across_1[_i];
        html += "<th scope=\"col\">" + num + "</th>";
    }
    html += "<tr></thead><tbody>";
    var tabIndex = 1;
    for (var _a = 0, down_1 = down; _a < down_1.length; _a++) {
        var num = down_1[_a];
        html += "<tr>";
        html += "<th scope=\"row\">" + num + "</th>";
        for (var i = 0; i < size; i++)
            html += "<td class=\"wrong\"><div class=\"sum hidden\">" + across[i] + " x " + num + "</div><div></div><input tabindex=\"" + tabIndex++ + "\" class=\"answer\" max=\"" + size *
                size + "\" min=\"1\" id=\"" + across[i] + ":" + num + "\"></td>";
        html += "</tr>";
    }
    html += "</tbody></table>";
    $(".grid").append(html);
    attachClicks();
    time = 0;
    clearInterval(timeInterval);
    timeInterval = setInterval(function () {
        time += 100;
        $(".timer").text((time / 1000).toFixed(1) + "s");
    }, 100);
    rightCount = 0;
};
var lastSize = Number(localStorage.getItem("size"));
var acrossJson = localStorage.getItem("across");
var across = (acrossJson && JSON.parse(acrossJson)) || [];
var downJson = localStorage.getItem("down");
var down = (downJson && JSON.parse(downJson)) || [];
if (size !== lastSize || !across.length || !down.length) {
    (_a = newGrid(), across = _a.across, down = _a.down);
}
$(".new-grid").click(function () {
    var _a;
    (_a = newGrid(), across = _a.across, down = _a.down);
    renderGrid(across, down);
});
renderGrid(across, down);
