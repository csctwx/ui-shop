<html>
<head>
	<script src="js/lib/jquery.min.js"></script>
<script>
var seo={
  stopped:true,
  skipped:false,
  rootPage:null,
  webSite:location.protocol+"//"+location.host+"/"+location.pathname.split("/")[1],
  curPage:null,
  pageMap:{},
  gotoPage:function(v){
    $("#path").val(v);
    this.rootPage=v.split("#")[0];
    $("#seo").remove();
    $('<iFrame id="seo" style="width:100%;height:100%" ></iFrame>').appendTo("#frameArea");
    $("#seo")[0].src=v;
  },
  stop:function(){
    this.stopped=true;
    $("#stopBtn").attr('disabled','disabled');
    $("#skipBtn").attr('disabled','disabled');
    $("#autoGenerateBtn").removeAttr('disabled');
    $("#goBtn").removeAttr('disabled');
  },
  skip:function(){
    this.skipped=true;
  },
  selectPath:function(v){
    var tr = $("#"+this.formatToId(v));
    $(".selectedTr").removeClass("selectedTr");
    tr.addClass("selectedTr");
    $("#path").val(this.rootPage+v);
  },
  generatePages:function(){
    this.cleanLinks();
    this.stopped=false;
    $("#goBtn").attr('disabled','disabled');
    $("#autoGenerateBtn").attr('disabled','disabled');
    $("#stopBtn").removeAttr('disabled');
    $("#skipBtn").removeAttr('disabled');
    
    this.rootPage=$("#path").val().split("#")[0];
    this.loadPage(this.rootPage);
  },
  loadPage:function(v){
    if(this.skipped){
      this.collectNextPage();
      return;
    }
    this.updateStatus(v,"wait");
    if(v){
      $("#seo")[0].src=v;
    }else if(this.isPageReady()){
      setTimeout("seo.storePage()",1000);
      return;
    }
    setTimeout("seo.loadPage()",1);
  },
  storePage:function(){
    var page={
      name:$("#seo")[0].contentWindow.location.hash,
      content:this.cleanPage()
    }

    $("#mainForm")[0].action=this.storePath;
    
    $("#pathName").val(page.name.substring(2));
    $("#content").val(page.content);
    $("#sitemap").val("");
    $("#mainForm")[0].submit();
    if(this.pageMap[page.name]===undefined){
      this.insertLink(page.name);
      this.selectPath(page.name);
    }
    this.pageMap[page.name]="done";
    this.updateStatus(page.name,"done");
    console.log("store page "+page.name)
    this.collectHash();
    if(!this.stopped){
      this.collectNextPage();
    }
  },
  collectHash:function(){
    var list=$("#seo")[0].contentWindow.$("a");
    for(var i=0;i<list.length;i++){
      var v=list[i].href;
      if(v.indexOf(this.webSite)==0 && v.indexOf("#!")>0){
        v="#!"+v.split("#!")[1];
        v=v.split("|")[0];
        if(v.substring(v.length-1)!="/"){
          v+="/";
        }
        if(this.pageMap[v]===undefined){
          console.log(v);
          this.pageMap[v]=null;
          this.insertLink(v);
        }
      }
    }
  },
  cleanPage:function(v){
    $("#seo")[0].contentWindow.$(".ng-hide").remove();
    var v=$("#seo")[0].contentDocument.documentElement.outerHTML;
    while(v.indexOf("<script")>0){
      var i=v.indexOf("<script");
      var ii=v.indexOf("<\/script>");
      v=v.substring(0,i)+v.substring(ii+9);
    }
    return v;
  },
  collectNextPage:function(){
    var pageCount=0;
    var names="";
    for(var k in this.pageMap){
      pageCount++;
      names+=k+"\n";
      if(!this.pageMap[k]){
        if(this.skipped){
          this.skipped=false;
          this.pageMap[k]="SKIPPED"
          continue;
        }
        $("#seo").remove();
        $('<iFrame id="seo" style="width:100%;height:100%" ></iFrame>').appendTo("#frameArea");
        this.loadPage(this.rootPage+k);
        this.selectPath(k);
        return;
      }
    }
    this.generateSiteMap();
    alert("Complete "+pageCount+" pages!");
    this.stop();
  },
  isPageReady:function(){
    if($("#seo")[0].contentWindow.$ && $("#seo")[0].contentWindow.$("#loading")){
      return $("#seo")[0].contentWindow.$("#loading").css("display")=="none";
    }
    return false;
  },
  loadSetting:function(){
    var v= localStorage.getItem("storePath");
    if(!v){
      v=$("#mainForm")[0].action;
    }
    this.storePath=v;
    localStorage.setItem("storePath",this.storePath);
    this.showSetting();
  },
  updateSetting:function(){
    var v =prompt("Set store path:",this.storePath);
    if(v){
      this.storePath=v;
      localStorage.setItem("storePath",this.storePath);
      this.showSetting();
    }
  },
  showSetting:function(){
    $("#storePath").html(this.storePath);
  },
  cleanLinks:function(v){
    this.pageMap={};
    $("#linkList").find("tr").remove();
  },
  insertLink:function(v){
    var tr = $("<tr id='"+this.formatToId(v)+"' title='Double click to store the page.'><td class='td1'>"+($("#linkList").find("tr").length+1)+"</td><td class='td1'><img src='img/wait.gif' style='display:none'/></td><td class='td2'>"+v+"</td></tr>");
    tr.appendTo("#linkList");
    tr[0].path=v;
    tr.click(function(){
      seo.selectPath(this.path);
      $("#goBtn").click();
    })
    tr.dblclick(function(){
      seo.loadPage(seo.rootPage+this.path);
    })
  },
  updateStatus:function(v,status){
    try{
      if(v.substring(0)!="#"){
        v="#"+v.split("#")[1];
      }
      $("#"+this.formatToId(v)).find("img").show();
      $("#"+this.formatToId(v)).find("img")[0].src="img/"+status+".gif";
      if(status=="wait"){
        $("#cover").show();
        if(!this.stopped){
          $("#listArea").scrollTop($("#listArea").scrollTop()+30);
        }
      }else{
        $("#cover").hide();
      }
    }catch(e){
      
    }
  },
  formatToId:function(v){
    return v.substring(2).replace(/\//g,"_").replace(/@/g,"");
  },
  generateSiteMap:function(){
    var v='<?xml version="1.0" encoding="UTF-8"?>\n';
    v+='<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    for(var k in this.pageMap){
      v+="  <url><loc>"+k+"</loc></url>\n";
    }
    v+="</urlset>";
    console.log(v);
    this.submitSiteMapData(v);
    alert("Generate Site Map Success!");
  },
  submitSiteMapData:function(d){
    $("#mainForm")[0].action=this.storePath;
    
    $("#pathName").val("");
    $("#content").val("");
    $("#sitemap").val(d);
    $("#mainForm")[0].submit();
    
  }
}

$(document).ready(function(){
  seo.loadSetting();
})
</script>
<style>
.td1{
  padding:0;
  border-right:1px solid #CCC;
  border-bottom:1px solid #CCC;
  width:0px;
}
.td2{
  padding:0;
  border-bottom:1px solid #CCC;
  width:100%;
}
.selectedTr{
  color:#00F;
}
</style>
</head>
<body>
<form method="POST" action="/sprint-seo-0.0.1-SNAPSHOT/indexfile" id="mainForm" target="postWindow">
  <input type="hidden" name="pagePath" id="pathName"/>
  <input type="hidden" name="content" id="content"/>
  <input type="hidden" name="sitemap" id="sitemap"/>
</form>

<table style="width:100%;height:100%">
  <tr style="height:0">
    <td colspan="2">
      <table style="width:100%">
        <tr>
          <td style="width:100%"/>
            <input id="path" value="index.jsp" style="width:100%"/>
          </td>
          <td style="width:0"/>
            <nobr>
              <button id="goBtn" onclick="seo.gotoPage($('#path').val())">Go</button>
              <button id="autoGenerateBtn" onclick="seo.generatePages()">Auto Generate All Pages</button>
              <button id="stopBtn" disabled="disabled" onclick="seo.stop()">Stop</button>
              <button id="skipBtn" disabled="disabled" onclick="seo.skip()">Skip</button>
              Store to: <a href="javascript:" id="storePath" onclick="seo.updateSetting()"></a>
            </nobr>
          </td>
        </tr>
      </table>
    </td>  
  </tr>
  <tr style="height:100%">
    <td style="width:25%">
      <table style="width:100%;height:100%;">
        <tr style="height:100%">
          <td>
            <div style="border:1px solid #CCC;overflow:auto;height:100%;" id="listArea">
              <table style="width:100%;">
                <thead>
                  <tr>
                    <th class="td1"></th>
                    <th class="td1"></th>
                    <th class="td2">Path</th>
                  </tr>
                </thead>
                <tbody id="linkList">
                </tbody>
              </table>
            </div>
          </td>
        </tr>
        <tr style="height:0">
          <td>
            <button onclick="seo.generateSiteMap()" style="float:right">Generate Site Map</button>
          </td>
        </tr>
      </table>
    </td>
    <td style="width:75%" id="frameArea">
      <iFrame id="seo" style="width:100%;height:100%" ></iFrame>
    </td>
  </tr>
</table>
<div id="cover" style="display:none;position:fixed;top:40px;left:0;bottom:0;background-color:#00F;opacity:0.1;width:100%"></div>
</body>
</html>
