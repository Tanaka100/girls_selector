const ans = [];
const ng = [];
const array = [];
var flg = true;

$(function () {

    // 初回用
    var id = searchId();
    setHtml(id, $('.image-field'+'.odd'));
    array.push(id);

    // 裏で次のツイートを読み込んでおく
    setTimeout(function () {
        var id = searchId();
        setHtml(id, $('.image-field'+'.even'));
        array.push(id);
    }, 3000);

    // ロード画面
    loading();

    // ボタンクリック
    $('button').on('click', function(e) {

        var id = searchId();

        // 飛ばすボタン
        if ($(this).text() != "飛ばす（読み込まれないとき）") {
            array.push(id);
        }

        // 裏にデータを入れる
        if (flg) {
            $('.image-field'+'.odd').hide();
            $('.image-field'+'.even').show();
            setHtml(id, $('.image-field'+'.odd'));
            $data = $("#tmp1");
        } else {
            $('.image-field'+'.even').hide();
            $('.image-field'+'.odd').show();
            setHtml(id, $('.image-field'+'.even'));
            $data = $("#tmp2");
        }
        
        // 累積データの取得
        let hairLength = Number($("#hairLength").html());
        let hairColor = Number($("#hairColor").html());
        let cuteCool = Number($("#cuteCool").html());
        let gal = Number($("#gal").html());
        let age = Number($("#age").html());
        let make = Number($("#make").html());
        
        // 今回のデータを反映
        if ($(this).hasClass('js-good')) {
            hairLength += Number(JSON.parse($data.html())['hairLength']);
            hairColor += Number(JSON.parse($data.html())['hairColor']);
            cuteCool += Number(JSON.parse($data.html())['cuteCool']);
            gal += Number(JSON.parse($data.html())['gal']);
            age += Number(JSON.parse($data.html())['age']);
            make += Number(JSON.parse($data.html())['make']);

            ans.push(id);
        } else {
            ng.push(id);
        }
        $("#hairLength").html(Math.round(hairLength*100)/100);
        $("#hairColor").html(Math.round(hairColor*100)/100);
        $("#cuteCool").html(Math.round(cuteCool*100)/100);
        $("#gal").html(Math.round(gal*100)/100);
        $("#age").html(Math.round(age*100)/100);
        $("#make").html(Math.round(make*100)/100);

        // 終了時
        if (ans.length == 20) {
            $('footer').remove();

            let ansHtml = '';
            ansHtml += '<div class="ans">';
            ansHtml += '<div class="ans-intro">あなたの好みは…</div>';

            a = setAns(hairLength, ans.length);
            ansHtml += '<span class="ans-title">髪の長さ</span>';
            ansHtml += `<div class="progress"><div class="progress-bar" role="progressbar" style="width: ${a}%;" aria-valuenow="${a}" aria-valuemin="0" aria-valuemax="100">${a}%</div></div>`;
            ansHtml += '<div class="ans-label"><div class="label-name">短い</div><div class="label-name">長い</div></div>';

            b = setAns(hairColor, ans.length);
            ansHtml += '<span class="ans-title">髪の色</span>';
            ansHtml += `<div class="progress"><div class="progress-bar" role="progressbar" style="width: ${b}%;" aria-valuenow="${b}" aria-valuemin="0" aria-valuemax="100">${b}%</div></div>`;
            ansHtml += '<div class="ans-label"><div class="label-name">黒髪</div><div class="label-name">派手</div></div>';

            c = setAns(cuteCool, ans.length);
            ansHtml += '<span class="ans-title">雰囲気</span>';
            ansHtml += `<div class="progress"><div class="progress-bar" role="progressbar" style="width: ${c}%;" aria-valuenow="${c}" aria-valuemin="0" aria-valuemax="100">${c}%</div></div>`;
            ansHtml += '<div class="ans-label"><div class="label-name">かわいい</div><div class="label-name">綺麗 </div><div class="label-name">クール</div></div>';

            d = setAns(gal, ans.length);
            ansHtml += '<span class="ans-title">属性</span>';
            ansHtml += `<div class="progress"><div class="progress-bar" role="progressbar" style="width: ${d}%;" aria-valuenow="${d}" aria-valuemin="0" aria-valuemax="100">${d}%</div></div>`;
            ansHtml += '<div class="ans-label"><div class="label-name">メンヘラ</div><div class="label-name">清楚</div><div class="label-name">ギャル</div></div>';

            e = setAns(age, ans.length);
            ansHtml += '<span class="ans-title">年齢</span>';
            ansHtml += `<div class="progress"><div class="progress-bar" role="progressbar" style="width: ${e}%;" aria-valuenow="${e}" aria-valuemin="0" aria-valuemax="100">${e}%</div></div>`;
            ansHtml += '<div class="ans-label"><div class="label-name">ロリ</div><div class="label-name">お姉さん</div></div>';

            f = setAns(make, ans.length);
            ansHtml += '<span class="ans-title">メイク</span>';
            ansHtml += `<div class="progress"><div class="progress-bar" role="progressbar" style="width: ${f}%;" aria-valuenow="${f}" aria-valuemin="0" aria-valuemax="100">${f}%</div></div>`;
            ansHtml += '<div class="ans-label"><div class="label-name">薄め</div><div class="label-name">濃いめ</div></div>';

            ansHtml += '<div class="ans-outro">▼ 最も好みに近いデータは以下です</div>';

            ansHtml += '</div>';

            $(".content").html(ansHtml);
            calcAns(hairLength/ans.length, hairColor/ans.length, cuteCool/ans.length, gal/ans.length, age/ans.length, make/ans.length);
        }
    });
});

function loading() {
    let h = $(window).height();
    $('#loading ,#spinner').height(h);

    // 2秒経ったら開始
    setTimeout(function () {
        $('.container').show();
        $('footer').show();
        $('#loading').delay(500).fadeOut(500);
        $('#spinner').delay(300).fadeOut(300);
    }, 2000);
}

// 出したことのないidをランダムに出す
function searchId() {
    let id = Math.floor(132 * Math.random());
    if ($.inArray(id, array) == -1){
        return id;
    } else {
        console.log("重複"+ id);
        return searchId();
    }
};

// ツイートをセットする
function setHtml(id, $field) {
    $.ajax({
        type: 'GET',
        url: './girls.json',
        dataType: 'json'
    })
    .then(
        // 取得成功時
        function (json) {
            //取得jsonデータ
            let data_stringify = JSON.stringify(json);
            let data_json = JSON.parse(data_stringify);
            let data = data_json[id]["code"];
            $field.html(data);

            let inputHtml = JSON.stringify(data_json[id]['params']);
            if (flg) {
                $("#tmp1").html(inputHtml);
            } else {
                $("#tmp2").html(inputHtml);
            }
            flg = !flg;
        },
        function () {
            // エラー発生時
            alert('エラー時に表示されるテキスト');
        }
    );
};

// 回答の数値に使う
// adjはcssのズレ補正
function setAns(data, num, adj = false) {
    if (adj) {
        var ans = Math.round(data / num *100 - 4);
    } else {
        var ans = Math.round(data / num *100);
    }
    return ans
}

// 好みに近いツイートの取得に使う関数
function calcAns(a, b, c, d, e, f) {
    let distance_arr = [];
    $.ajax({
        type: 'GET',
        url: './girls.json',
        dataType: 'json'
    })
    .then(
        // 取得成功時
        function (json) {
            //取得jsonデータ
            let data_stringify = JSON.stringify(json);
            let data_json = JSON.parse(data_stringify);

            for (var i = 0;  i < 132;  i++) {
                // ng内にあったら飛ばす
                if ($.inArray(i, ng) != -1){
                    continue;
                }
                distance = 0;
                console.log(data_json[i]['params']['hair0Length'], a);
                distance += Math.pow(data_json[i]['params']['hairLength'] - a, 2);
                distance += Math.pow(data_json[i]['params']['hairColor'] - b, 2);
                distance += Math.pow(data_json[i]['params']['cuteCool'] - c, 2);
                distance += Math.pow(data_json[i]['params']['gal'] - d, 2);
                distance += Math.pow(data_json[i]['params']['age'] - e, 2);
                distance += Math.pow(data_json[i]['params']['make'] - f, 2);
                distance_arr.push(distance / 6);
            }

            let id = distance_arr.indexOf(Math.min(...distance_arr))
            console.log(distance_arr);
            console.log(id);
            
            $('.content').append(data_json[id]['code']);
        },
        function () {
            // エラー発生時
            alert('エラー時に表示されるテキスト');
        }
    );
};