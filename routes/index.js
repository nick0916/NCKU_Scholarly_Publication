var express = require('express');
var router = express.Router();
var con = require('../wos_mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {  });
});

// router.get('/researcher', function(req, res, next) {
// 	var sql = 'select teacherfulltime.*, teacherInfo.reverseName from teacherfulltime left join teacherInfo on teacherInfo.id = teacherfulltime.id order by reverseName';
// 	con.query(sql, function(err, teacher){
// 		if(err) throw err;
// 		// console.log(teacher);
// 	});
//   res.render('researcher', {  });
// });

router.get('/researchers', function(req,res){
  var dt = new Date();
  console.log("========================================");
  console.log(dt);
  console.log("========================================");
  // 取得時間


  var all_teacher; // 放置所有老師的地方
  var query_teacher = []; //查詢老師結果存放區
  var group = []; // 總頁碼放置區
  var pages = 0; // 總頁碼數
  var show_page = []; // 放入要秀出的頁碼

  var ctr = 1; // 用來計算teacher/space的量 (總共有幾群老師，來知道有多少頁)
  var obj = {}; // 為了顯示html所放入group的object
  obj.page = ctr;
  group.push(obj); // 放入起始頁碼

  var item = 0; // 用來記錄累計次數
  var number = 0; // 用來記錄老師總數
  var space = 10; // 頁面放置老師數量
  var letter = [
    {content:"A"},
    {content:"B"},
    {content:"C"},
    {content:"D"},
    {content:"E"},
    {content:"F"},
    {content:"G"},
    {content:"H"},
    {content:"I"},
    {content:"J"},
    {content:"K"},
    {content:"L"},
    {content:"M"},
    {content:"N"},
    {content:"O"},
    {content:"P"},
    {content:"Q"},
    {content:"R"},
    {content:"S"},
    {content:"T"},
    {content:"U"},
    {content:"V"},
    {content:"W"},
    {content:"X"},
    {content:"Y"},
    {content:"Z"},
  ];

  var sql ; // sql語法
  var current; // 目前正在預覽的頁碼
  var current_max; // 可預覽頁碼的最大值
  var previous; // 欲往前的頁碼
  var next; // 欲往後的頁碼



  if(req.query.letter == 'All'){
    sql = 'select teacherfulltime.*, teacherInfo.reverseName from teacherfulltime left join teacherInfo on teacherInfo.id = teacherfulltime.id order by reverseName';
  }
  else if(req.query.letter != undefined){
    sql = 'select teacherfulltime.*, teacherInfo.reverseName from teacherfulltime left join teacherInfo on teacherInfo.id = teacherfulltime.id where reverseName like "' + req.query.letter + '%"';
  }

  left_query();


  function left_query(){

    con.query('select teacherfulltime.*, teacherInfo.reverseName from teacherfulltime left join teacherInfo on teacherInfo.id = teacherfulltime.id order by reverseName', function(err, results, fields){
      if(err) throw err;
      all_teacher = results;
      right_query();
    });

  }
  


  function right_query(){
    con.query(sql, function(err, results, fields){
      if(err) throw err;
      console.log(results.length);
      if(results.length == 0){
        res.render('researchers', {
          error:true,
          "all_teacher": all_teacher,
          "letter":letter,
        });
        return 0;
      }

      var index = 0; // 計算目前老師累積的次數到哪

      page_calculate();
      
      function page_calculate(){

        for (var i = 0; i < space; i++){
          number ++
          if (results[index+ i + 1] != undefined && i == (space - 1)){
            index = ctr * space;
            ctr++
            pages = ctr;
            var obj = {};
            obj.page = ctr; // 製造出頁碼的obj
            group.push(obj); // 放入頁碼
            page_calculate(); // 用遞迴的方式
            break;
          }
          if(results[index + i + 1] === undefined){
            break;
          }
        }
      }; // 計算要製造多少頁面（分群）

      current = (req.query.page - 1) * space; // 要找出目前要瀏覽第幾筆資料（初始值）
      current_max = current + space; // 算出目前要瀏覽第幾筆資料（最大值）


      if (req.query.page == group.length){
        current_max = number;
      } // 頁尾的餘數計算

      for (var i = 0; i < space; i++){
         if(results[current + i].title == '教授') results[current + i].title = 'Professor';
        else if (results[current + i].title == '副教授') results[current + i].title = 'Associate Professor';
        else if (results[current + i].title == '助理教授') results[current + i].title = 'Assistant Professor';
        //轉換老師教授的職稱（中英）
        query_teacher.push(results[current + i]);

        if(results[current + i + 1] === undefined){
          break;
        }
      } // 秀頁碼機制


      if(req.query.page > 3 && pages > parseInt(req.query.page) + 2){
        for(var i = 0; i < 5; i++){
          var obj = {};
          obj.page = parseInt(req.query.page) - 2 + i;
          show_page.push(obj);
        }
      }
      else if (pages <= parseInt(req.query.page) + 2){
        if(pages > 5){
            for(var i = 4; i >= 0; i--){
            var obj = {};
            obj.page = pages - i;
            show_page.push(obj);
          }
        }
        else{
            for(var i = 1; i <= pages; i++){
            var obj = {};
            obj.page = i;
            show_page.push(obj);
          }
        }  
      }
      else{
        for(var i = 1; i <= 5; i++){
          var obj = {};
          obj.page = i;
          show_page.push(obj);
        }
      } // 自動頁碼補齊系統



      previous = parseInt(req.query.page) - 1;
      if (previous == 0){
        previous = 1;
      } // 頁碼往前


      next = parseInt(req.query.page) + 1;
      if (next > ctr){
        next = ctr;
      } // 頁碼往後

      end();
    });

  } // 右邊的teacher搜尋


  function end(){
    res.render('researchers', {
      "all_teacher": all_teacher,
      "query_teacher": query_teacher,
      "group": group,
      previous: previous,
      next: next,
      "current_page": req.query.page,
      "letter":letter,
      select_l : req.query.letter,
      "number": number,
      "current_min": current + 1,
      "current_max": current_max,
      show_page: show_page,
      error:false
    });
  }
});

router.get('/researchers/teacher', function(req,res){

  // res.render('teacher');

  var teacherlist = [];  // 同系所老師名單
  var dpart = req.query.depart;
  var queryTeacher = {};
  var pub_name;
  var title;
  // researcher 宣告
  var id;
  var authorID = 0;
  var ncku_paper = 0;
  var ncku_paperType = [];
  var paper = [];
  var paperType = [];
  var education = [];
  var experience = [];
  var honor = [];
  var pic = 'noPicture'; // 暫時的大頭貼

  var for_char_data = {};
  var for_char_data2 = {};
  var list = [];
  var count = {};
  var citations = 0;
  var cite_sort = [];
  var h_index = 0;

  //暫時
  var experience_t = [];
  var skill = [];

  if ([req.query.name] == "高強"){
    pic = 'college/管理學院/工資管系/高強';
  } // 應急用的

  con.query('Select * from teacherfulltime where DID = ?', [req.query.depart], function(err, results, fields){
    if(err) throw err;
    for (var i = 0; i < results.length ;i++){
      teacherlist.push(results[i]);
      
      if(results[i].id == req.query.id){
        publications_number = results[i].paper_number;
        id = results[i].id;

        if(results[i].title == '教授') results[i].title = 'Professor';
        else if (results[i].title == '副教授') results[i].title = 'Associate Professor';
        else if (results[i].title == '助理教授') results[i].title = 'Assistant Professor';
        //轉換老師教授的職稱（中英）

        queryTeacher = results[i];

        if(results[i].authorID !== undefined) authorID = results[i].authorID;



        if(results[i].experience != null){  
          experience_t = results[i].experience.split("<br>");
          for(j in experience_t){
            var buffer = experience_t[j].split(" ");
            experience_t[j] = buffer[0] +　" ---"　+ buffer[1];
          }
        }// 找出老師學經歷
        experience_t.pop();
        


        if(results[i].skill != null){
          skill = results[i].skill.split(/\n|\t|\r/g);
          for(j in skill){
            skill[j] = skill[j].split(", ");
          }
        }// 將老師的專長做排版處理
      }
    }
    if(req.query.id === undefined){
        if(results.length == 0){
            depart_n = "not find this department";
            console.log(req.url);
            res.render('error',{
               message: '此系所還未建置，請先回上一頁囉',
            });
            return 0;
        }
        queryTeacher = results[0];
        id = results[0].id;
        authorID = results[0].authorID;


    } // 剛從college 點進去時，第一個出現教授的default值
    find_paper_2();
    // query_education();

  });


  function splitFamilyName(name){
      var nameArray = name.split(",");
      name = nameArray[1] + " " + nameArray[0];
      return name;
  };

  function find_paper_2(){
    var sql = 'select * from scopuspaper where authorID = ' + "\'" + authorID + "\'";
    con.query(sql, function(err, results, fields){
      if(err) throw err;
      var paper_number = 0;
      var cite = 0;
      var cite_average = 0;
      publication_early = 0;
      publication_old = 0;

      find_paper();

      // res.render('teacher',{ 
      //   "queryTeacher": queryTeacher,


      //   "teacherlist": teacherlist,
      //   "queryTeacher": queryTeacher,

      //   "experience_t": experience_t, // 學經歷抓取
      //   "skill":skill,
      //   "paper": paper,
      //   pic: pic,

      //   publications_number: paper.length,
      //   Article_number: paperType[0],
      //   Conference_paper_number: paperType[1],
      //   Book_chapter_number: paperType[2],
      //   Others: paperType[3],

      //   // 有ncku的paper計算
      //   ncku_publications_number: ncku_paper,
      //   ncku_Article_number: ncku_paperType[0],
      //   ncku_Conference_paper_number: ncku_paperType[1],
      //   ncku_Book_chapter_number: ncku_paperType[2],
      //   ncku_Others: ncku_paperType[3],

      //   authorID: authorID
      // });
    });
  };
  function find_paper(){
    var sql = 'select * from scopuspaper_all_small where authorID = ' + "\'" + authorID + "\'";

    con.query(sql, function(err, results, fields){
      if(err) throw err;
      paperType[0] = 0;
      paperType[1] = 0;
      paperType[2] = 0;
      paperType[3] = 0;
      ncku_paperType[0] = 0;
      ncku_paperType[1] = 0;
      ncku_paperType[2] = 0;
      ncku_paperType[3] = 0;

      // 找paper 分類
      for(var i = 0; i < results.length; i++){
        entry = JSON.parse(results[i].entry); // 解析json
        paper.push(entry);// 將paper放置進去

        citations = citations + Number(entry["citedby-count"]);
        cite_sort.push(Number(entry["citedby-count"]));
        
        var year = entry["prism:coverDate"];
        year = year.split("-");
        if(!for_char_data.hasOwnProperty(year[0])){
          for_char_data[year[0]] = {};
          var buf = for_char_data[year[0]];
          buf[entry["subtypeDescription"]] = 1;

          if (Number.isInteger(count[entry["subtypeDescription"]]))
            count[entry["subtypeDescription"]] += 1;
          else count[entry["subtypeDescription"]] = 1;
          // for(var j in list){
          //   if(list[j] == entry["subtypeDescription"]){
          //     delete list[j];
          //     break;
          //   }
          // }
          // list.push(entry["subtypeDescription"]);
        }
        else if (for_char_data[year[0]].hasOwnProperty(entry["subtypeDescription"])){
          var buf = for_char_data[year[0]];
          buf[entry["subtypeDescription"]] += 1;

          count[entry["subtypeDescription"]] += 1;
        } 
        else {
          var buf = for_char_data[year[0]];
          buf[entry["subtypeDescription"]] = 1;

          if (Number.isInteger(count[entry["subtypeDescription"]]))
            count[entry["subtypeDescription"]] += 1;
          else count[entry["subtypeDescription"]] = 1;
          // for(var j in list){
          //   if(list[j] == entry["subtypeDescription"]){
          //     delete list[j];
          //     break;
          //   }
          // }
          // list.push(entry["subtypeDescription"]);
        }





        // 分類
        // if(entry["subtypeDescription"] == 'Article') paperType[0]++;
        // else if(entry["subtypeDescription"] == 'Conference Paper') paperType[1]++;   
        // else if(entry["subtypeDescription"] == 'Chapter' || entry["subtypeDescription"] == 'Book') paperType[2]++;
        // else paperType[3]++;

        // 尋找ncku_paper
        // var auth = entry["author"];
        // if(auth[0].afid === undefined) continue; // 有些作者沒有提供afid
        // for(j in auth){
        //   if(!auth[j].hasOwnProperty('0')) continue;
        //     var aff = auth[j].afid[0];

        //     if(aff !== undefined && aff["$"] == '60014982'){
        //       if(entry["subtypeDescription"] == 'Article') ncku_paperType[0]++;
        //       else if(entry["subtypeDescription"] == 'Conference Paper') ncku_paperType[1]++;   
        //       else if(entry["subtypeDescription"] == 'Chapter' || entry["subtypeDescription"] == 'Book') ncku_paperType[2]++;
        //       else ncku_paperType[3]++;
        //       ncku_paper++;
        //       break;
        //     }
        // }
      }

      cite_sort.sort(function(a, b){
        return b - a;
      });

      for(var i in cite_sort){
        if(cite_sort[i] < i) {
          h_index = cite_sort[i - 1];
          break;
        }
      }

      list = Object.keys(count);
      list = list.sort(function(a, b){
        return count[a] < count[b];
      });

      for(var j in list){
        for_char_data2[list[j]] = [];
      }

      for (var j in for_char_data){
        for(var k in list){
          if(for_char_data[j].hasOwnProperty(list[k])){
            var buf = for_char_data[j];
            for_char_data2[list[k]].push(buf[list[k]]);
          }
          else for_char_data2[list[k]].push(0);
        }
      }
      console.log(cite_sort);
      // console.log(list);
      // for(var i in for_char_data2){
      //   console.log(i + ": " + for_char_data2[i].length);
      // }
      // console.log(for_char_data2);
      res.render('teacher',{ 
        "teacherlist": teacherlist,
        "queryTeacher": queryTeacher,

        // "experience_t": experience_t, // 學經歷抓取
        "skill":skill,
        "paper": paper,
        pic: pic,
        "data": for_char_data2,
        "year": Object.keys(for_char_data),
        "title": list,
        "color": ['rgb(255, 255, 255)', 'rgb(204, 204, 204)', 'rgb(153, 153, 153)', 'rgb(128, 128, 128)', 'rgb(77, 77, 77)', 'rgb(51, 51, 51)'],
        citations: citations,
        citations_a: citations / paper.length,
        "count": count,
        h_index: h_index,
        // publications_number: paper.length,
        // Article_number: paperType[0],
        // Conference_paper_number: paperType[1],
        // Book_chapter_number: paperType[2],
        // Others: paperType[3],

        // 有ncku的paper計算
        // ncku_publications_number: ncku_paper,
        // ncku_Article_number: ncku_paperType[0],
        // ncku_Conference_paper_number: ncku_paperType[1],
        // ncku_Book_chapter_number: ncku_paperType[2],
        // ncku_Others: ncku_paperType[3],

        authorID: authorID
      });
    });
  }
});

module.exports = router;
