// returns jq div
function paramsToGui() {
    let div = $('<div class="accordion" id="accordionExample"></div>');
    let prevCategory = ""; let currBg = 0; let bgClass = "";
    Params.forEach(function (p) {
        if (p.category != prevCategory) {
            prevCategory = p.category;
            currBg++;
            bgClass = currBg%2 ? "" : "bg-gray";
        }
        function onParamChanged(e) {
            Glob[p.name] = Number.parseFloat($(this).val());
            $("#presetSelect").val('')
        }
        let id = 'prm-' + p.name;
        let label = $("<label></label>").attr('for', "#"+id).addClass('col-6 mb-0').append(p.name);
        let input = $("<input type='range'></input>")
            .attr('id', id)
            .attr('min', 0)
            .attr('max', 1)
            .attr('step', 0.01)
            .val(Glob[p.name])
            .on('input', onParamChanged);

        let row = $("<div class='row'></div>").append(label, input).addClass(bgClass).attr('title', p.descr);
        div.append(row);
    });
    return div;
}

// reutrns jq select
function jqPresetsSelect() {
    function onPresetSelected() {
        let name = select.val();
        if (name.trim() == '')
            return;
        if (!Presets.hasOwnProperty(name))
            return console.warn("preset not found: ", name);
        let preset = Presets[name];
        Params.forEach(function (p) {
            Glob[p.name] = preset[p.name];
            $("#" + 'prm-' + p.name).val(Glob[p.name]);
        });
    }

    var select = $("<select class=''></select>").on('input', onPresetSelected).attr('id', 'presetSelect');
    for (var name in Presets) if (Presets.hasOwnProperty(name)) {
        let option = $("<option></option>").html(name).val(name);
        select.append(option);
    };
    select.prepend($("<option></option>").html('').val(''))
    select.val('default');
    return select;

}
