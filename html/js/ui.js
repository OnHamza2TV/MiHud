// status
setProgress = (element, percent) => {
    const Circumference = element.prop('r').baseVal.value * 2 * Math.PI;
    const Offset = Circumference - percent / 100 * Circumference;

    element.css({
        strokeDasharray: `${Circumference} ${Circumference}`,
        strokeDashoffset: Offset
    });
}

onload = () => {
    addEventListener('message', (event) => {
        switch (event.data.action) {
            case 'update': // update status
                $.each(event.data.data, (key, value) => {
                    const K = $(`#${key} circle`);
                    if (K.length) {
                        setProgress(K, value);
                    }
                });
                break;
            case 'panel': // toggle panel visibility
                $('#panel').toggle();
                break;
            case 'proximity': // update proximity
                setProgress($('#voice circle'), event.data.data);
                break;
            case 'talking': // talking/not talking
                const Colors = JSON.parse(localStorage.getItem('hud_colors'));
                const NormalColor = Colors.hasOwnProperty('voice') ? Colors['voice'] : 'white';
                const ActiveColor = Colors.hasOwnProperty('voice-active') ? Colors['voice-active'] : 'red';

                $('#voice circle').css('stroke', event.data.data ? ActiveColor : NormalColor);
                $('#voice image').attr('href', event.data.data ? 'images/online-active.png' : 'images/online.png');
                break;
            case 'inCar': // event.data.data -> is player in vehicle
                $('#status').css('justify-content', event.data.data ? 'center' : 'flex-start');
                break;
        }
    });
}

// retrieve colors
{
    const Colors = JSON.parse(localStorage.getItem('hud_colors'));

    if (Colors) { // we have something saved
        $.each(Colors, (key, value) => {
            $(`#${key} circle`).css('stroke', value);
        });
    }
}

// picker
let colorPicker = new iro.ColorPicker('#picker', {
    borderWidth: 1,
    borderColor: '#7B68EE',
    layoutDirection: "horizontal",
    layout: [
        {
            component: iro.ui.Box,
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'hue'
            }
        }
    ]
});

colorPicker.on('color:change', color => {
    const Hex = color.hexString;
    const Selected = $('input[name=color]:checked').val();

    if (Selected.length) { // exists
        $(`#${Selected} circle`).css('stroke', Hex);

        const Colors = JSON.parse(localStorage.getItem('hud_colors'));
        let table = Colors ? Colors : JSON.parse('{}');
        table[Selected] = Hex;
        localStorage.setItem('hud_colors', JSON.stringify(table));
    }
}); 