function tagClassNameByElement(el) {
    if (el == 'x')
        return 'xtag';
    if (el == 't')
        return 'ttag';
    if (el == 'w')
        return 'wtag';
    if (el == 'e')
        return 'etag';
    if (el == 'c')
        return 'ctag';
    return 'dtag';
}

function elementName(el) {
    if (el == '')
        return 'none';
    if (el == 'x')
        return 'x-centers';
    if (el == 't')
        return 't-centers';
    if (el == 'w')
        return 'wings';
    if (el == 'e')
        return 'edges';
    if (el == 'c')
        return 'corners';
    return el;
}

function applyFilter(elem) {
    if (elem == "") {
        tables.sort(compareTables);
    } else {
        tables.sort(function(a,b) {
            if (a["elements"][elem] == null) return -1;
            if (b["elements"][elem] == null) return 1;
            var cRes = a["elements"][elem].localeCompare(b["elements"][elem]);
            if (cRes != 0)
                return cRes;
            return a["rank"] < b["rank"] ? -1 : 1;
        });
    }
    document.getElementById("maintable").innerHTML = composeHtmlTable(elem);
}

function composeHtmlTable(filter) {
    var content = "";
    var alt=0;
    window.tables.forEach(function (obj) {
        var matchesFilter = (filter=="" || Object.keys(obj["elements"]).indexOf(filter) != -1);
        if (matchesFilter) {
            // if tags don't contain filter - continue
            content += "<tr"+ ((alt++%2)?"":" class='alt'") +">";
            // author TODO if no authorSs then no link
            if (obj["authorSs"] != "")
                content += "<td><a class='personLink' href='http://speedsolving.com/forum/members/?username=" + obj["authorSs"] + "' target=_blank>" + obj["author"] + "</a></td>";
            else
                content += "<td><a class='personLink'>" + obj["author"] + "</a></td>";

            // elem.
            content += "<td>";
            if (filter == "") {
                for (var elem in obj["elements"]) {
                    content += "<span class='tags "+tagClassNameByElement(elem) +
                        "' title='"+elemName(elem)+"' onclick='applyFilter(\""+elem+"\")'><a href='#"+elem+"'>"+
                        elem +
                        "</a></span>";
                }
            } else {
                    content += "<span class='tags "+tagClassNameByElement(filter) +
                        "' title='"+elemName(filter)+"' onclick='applyFilter(\"\")'><a href='#'>"+
                        filter +
                        "</a></span>";
            }
            content += "</td>";

            // buff.
            content += "<td>";
            var cnt = 0;
            if (filter == "") {
                for (var elem in obj["elements"]) {
                    if (cnt++ > 0)
                        content += ", ";
                    content += "<span class='buffer' title='"+elementName(elem)+"'>"+obj["elements"][elem]+"</span>";
                }
            } else {
                content += "<span class='buffer' title='"+elementName(filter)+"'>"+obj["elements"][filter]+"</span>";
            }
            content += "</td>";

            // preview
            content += "<td>";
            obj["preview"].forEach(function(previewName){
                content += "<img class='preview' src='pr/small/"+previewName+".jpg' onclick=\"previewPicture('pr/big/"+previewName+".jpg')\"/> ";
            });
            content += "</td>";

            // link
            var urlHtml = (obj["url"] == "") ? "" : "<a class='mainLink' href='" + obj["url"] + "' target=_blank>click</a>";
            content += "<td>"+urlHtml+"</td>";

            // mirrors
            content += "<td>";
            cnt=0;
            for (var mrr in obj["mirrors"]) {
                if (obj["mirrors"][mrr] != "") {
                    if (cnt++ > 0)
                        content += ", ";
                    content += "<a class=mirrorLink href='" + obj["mirrors"][mrr] + "' target=_blank>"+mrr+"</a>";
                }
            }
            content += "</td>";

            content += "</tr>";
        }
    });
    return content;
}


/**/
function composeSpeedsolvingTable() {
    var content = "[TABLE]\n[TR][TD][B]Author[/B][/TD][TD][B]Elements[/B][/TD][TD][B]Buffers[/B][/TD][TD][B]URL[/B][/TD][TD][B]Mirrors[/B][/TD][/TR]";
    var alt=0, cnt=0;
    window.tables.forEach(function (obj) {
        // if tags don't contain filter - continue
        content += (alt++%2) ? "[TR]" : "[TR]";

        var personUrl = (obj["authorSs"] == "") ? obj["author"] : "[URL=\"http://speedsolving.com/forum/members/?username="+obj["authorSs"]+"\"]"+obj["author"]+"[/URL]";
        content += "[TD]"+personUrl+"[/TD]";

        // elem.
        content += "[TD]";
        cnt = 0;
        var elemContent = "";
        for (var elem in obj["elements"]) {
            if (cnt++ > 0)
                elemContent += ", ";
            elemContent += elem;
        };
        content += (elemContent==""?"-":elemContent) + "[/TD]";

        // buff.
        content += "[TD]";
        cnt = 0;
        var buffersContent = "";
        for (var elem in obj["elements"]) {
            if (cnt++ > 0)
                buffersContent += ", ";
            buffersContent += obj["elements"][elem];
        };
        content += (buffersContent==""?"-":buffersContent) + "[/TD]";

        // link
        var urlHtml = (obj["url"] == "") ? "-" : "[URL=\"" + obj["url"] + "\"]click[/URL]";
        content += "[TD]"+urlHtml+"[/TD]";

        // mirrors
        content += "[TD]";
        cnt=0;
        for (var mrr in obj["mirrors"]) {
            if (obj["mirrors"][mrr] != "") {
                if (cnt++ > 0)
                    content += ", ";
                content += "[URL=\"" + obj["mirrors"][mrr] + "\"]"+mrr+"[/URL]";
            }
        }
        content += "[/TD]";

        content += (alt%2) ? "[/TR]" : "[/TR]";
    });
    content += "[/TABLE]";
    return content;
}
