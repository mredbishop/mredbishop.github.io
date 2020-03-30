interface JQuery {
    fireworks: any;
}

var time = 0;
var timeInterval: any;
var rightCount = 0;
const size = 12;
const random = (from: number, toLessThan: number) => {
    from = Math.ceil(from);
    toLessThan = Math.floor(toLessThan);
    return Math.floor(Math.random() * (toLessThan - from)) + from;
};

const newGrid = () => {
    const across = [] as Array<number>;
    const down = [] as Array<number>;

    let count = size;
    do {
        const index = random(0, across.length + 1);
        across.splice(index, 0, count);
    } while (--count);
    localStorage.setItem("across", JSON.stringify(across));

    count = size;
    do {
        const index = random(0, down.length + 1);
        down.splice(index, 0, count);
    } while (--count);
    localStorage.setItem("down", JSON.stringify(down));

    return { across, down };
};

let celebrating = false;

const checkAnswers = (element: HTMLInputElement, cancelEventOnImpossibleAnswer = false) => {
    if (celebrating) return;

    const possibleAnswer = Number($(element).val());
    if (isNaN(possibleAnswer)) {
        if (cancelEventOnImpossibleAnswer) event?.preventDefault();
        return;
    }

    const parts = element.id.split(":");
    const a = Number(parts[0]);
    const b = Number(parts[1]);
    const answer = a * b;

    if (answer === possibleAnswer) {
        if (element.parentElement && $(element.parentElement).hasClass("wrong")) {
            $(element.parentElement)
                .removeClass("wrong")
                .addClass("right");
            rightCount++;
            const tabIndex = Number($(element).attr("tabindex")) + 1;
            $("[tabindex=" + tabIndex + "]").focus();
        }
    } else {
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
        setTimeout(() => $("body").fireworks({ destroy: true }), 10000);
    }
};

const attachClicks = () => {
    $(".answer").focus(function(event) {
        $(this)
            .parent()
            .children(".sum")
            .removeClass("hidden");
    });

    $(".answer").blur(function(event) {
        $(this)
            .parent()
            .children(".sum")
            .addClass("hidden");
        checkAnswers(this as HTMLInputElement);
    });

    $(".answer").keyup(function(event) {
        checkAnswers(this as HTMLInputElement, true);
    });

    $(".answer").keydown(function(event) {
        if (event.keyCode === 9) return;

        const cellIndex = ($(this).parent()[0] as HTMLTableCellElement).cellIndex;

        switch (event.keyCode) {
            case 37:
                const left = $(this)
                    .parent()
                    .prev()
                    .children(".answer");
                if (left) left.focus();
                break;
            case 38:
                const above = $(
                    $(this)
                        .parent()
                        .parent()
                        .prev()
                        .children()[cellIndex]
                ).children(".answer");
                if (above) above.focus();
                break;
            case 39:
                const right = $(this)
                    .parent()
                    .next()
                    .children(".answer");
                if (right) right.focus();
                break;
            case 40:
                const below = $(
                    $(this)
                        .parent()
                        .parent()
                        .next()
                        .children()[cellIndex]
                ).children(".answer");
                if (below) below.focus();
                break;
            default:
                const length = ($(this).val() as string).length;
                const numMin = length ? 48 : 49;
                const numPadMin = length ? 96 : 97;

                if (event.keyCode !== 46 && event.keyCode !== 8 && (event.keyCode < numMin || event.keyCode > 57) && (event.keyCode < numPadMin || event.keyCode > 105)) {
                    return event.preventDefault();
                }

                const value = (event.keyCode >= numMin && event.keyCode <= 57) || (event.keyCode >= numPadMin && event.keyCode <= 105) ? event.key : "";

                const textBox = this as HTMLInputElement;
                if (textBox.selectionStart === null || textBox.selectionEnd === null || textBox.selectionStart === null) return;
                var t = textBox.value.substr(textBox.selectionStart, textBox.selectionEnd - textBox.selectionStart);

                const currentValue = ($(this).val() as string).replace(t, "") || "";

                const possibleAnswer = Number(currentValue + value);
                if (isNaN(possibleAnswer)) return event.preventDefault();

                if (!t && value && possibleAnswer > size * size) return event.preventDefault();
        }
    });
};

const renderGrid = (across: Array<number>, down: Array<number>) => {
    $(".grid").empty();

    let html = '<table class="table table-bordered"><thead><tr><th scope="col" class="timer"></th>';

    for (let num of across) html += `<th scope="col">${num}</th>`;

    html += "<tr></thead><tbody>";
    let tabIndex = 1;
    for (let num of down) {
        html += "<tr>";
        html += `<th scope="row">${num}</th>`;
        for (let i = 0; i < size; i++)
            html += `<td class="wrong"><div class="sum hidden">${across[i]} x ${num}</div><div></div><input tabindex="${tabIndex++}" class="answer" max="${size *
                size}" min="1" id="${across[i]}:${num}" readonly></td>`;
        html += "</tr>";
    }

    html += "</tbody></table>";

    $(".grid").append(html);

    attachClicks();

    time = 0;
    clearInterval(timeInterval);

    timeInterval = setInterval(() => {
        time += 100;
        $(".timer").text(`${(time / 1000).toFixed(1)}s`);
    }, 100);

    rightCount = 0;
};

let lastSize = Number(localStorage.getItem("size"));

let acrossJson = localStorage.getItem("across");
let across = (acrossJson && JSON.parse(acrossJson)) || [];

let downJson = localStorage.getItem("down");
let down = (downJson && JSON.parse(downJson)) || [];

if (size === lastSize && across.length && down.length) {
    renderGrid(across, down);
}

$(".new-grid").click(() => {
    ({ across, down } = newGrid());
    $('#new-grid').text('New Grid!');
    renderGrid(across, down);
});
