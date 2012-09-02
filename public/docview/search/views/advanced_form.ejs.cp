﻿<form class="advanced form-horizontal">
<div class="row-fluid">
    <div id="search_tree" class="span2">
      <ul class="nav nav-pills">


   <% if (this.single) { %>
        <li><a href="#single"  class="button-title btn" >单票查阅</a></li>
   <%}%>
   <% if (this.multi) { %>
        <li><a href="#multi"  class="button-title btn" >批量查阅</a></li>
   <%}%>
   <% if (this.advanced) { %>
        <li><a href="#advanced"  class="button-title btn" >随机抽查阅</a></li>
   <% } %>
   <%if(this.upload_file){%>
        <li><a href="#upload_file"  class="button-title btn" >文件上传</a></li>
   <% } %>
   <%if(this.search_condition){%>
        <li><a href="#search_condition"  class="button-title btn" >按特定条件查询</a></li>
   <%}%>
   <% if (this.by_doc_source) { %>
        <li><a href="#by_doc_source"  class="button-title btn" >单证暂存</a></li>
   <%}%>
        <li><a href="#personal_history"  class="button-title btn" >个人历史查阅</a></li>
      </ul>
    </div>
    <div id="search-viewer" class="span10">
    <fieldset>
     <div class="control-group">
      <label  class="control-label" for="frm_total">随机抽样份数</label>
      <div class="controls">
	 <label class="radiobox"><input type="radio" name="frm_total" value="5" checked='checked'>5份</input></label>
	 <label class="radiobox"><input type="radio" name="frm_total" value="10" >10份</input></label>
	 <label class="radiobox"><input type="radio" name="frm_total" value="20" >20份</input></label>
	 <label class="radiobox"><input type="radio" name="frm_total" value="50" >50份</input></label>
	 <label class="radiobox"><input type="radio" name="frm_total" value="" >其他</input></label>

         <input name="total" id="frm_total" type="text" >

      </div>
    </div>

 <%== $.View('//docview/ui/views/org_radio.ejs', { label: '关区', name : 'org'} ) %>
 
    <div class="control-group">
      <label  class="control-label" for="frm_doctype">进出口种类</label>
      <div class="controls">
          <label class="radiobox"><input type="radio" name="frm_docType" value=""  checked='checked'>不限</input></label>
          <label class="radiobox"><input type="radio" name="frm_docType" value="JK" >进口</input></label>
          <label class="radiobox"><input type="radio" name="frm_docType" value="CK" >出口</input></label>
      </div>
   </div>

   <div class="control-group">
        <label  class="control-label" for="frm_isMod_or_isTax">业务类型</label>
       <div class="controls">            
	    <label class="radiobox"><input type="radio" name="frm_isMod_or_isTax" value=""  checked='checked'>不限</input></label>
	    <label class="radiobox"><input type="radio" name="frm_isMod_or_isTax" value="isMod" >删改单</input></label>
	    <label class="radiobox"><input type="radio" name="frm_isMod_or_isTax" value="isTax" >退补税</input></label>
        </div>
   </div>

   <div class="control-group daterange-holder"></div>
   
   <div class="control-group">
       <div class="controls">            
           <button type="submit" class="btn btn-primary"><i class="icon-search icon-white"></i><%= $.i18n._('btn.search')  %></button>
           <%== $.View('//docview/search/views/filters_form.ejs', {type: "advanced"}) %>
       </div>
   </div>
</fieldset>

</div>
</form>