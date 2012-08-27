﻿<form class="advanced form-horizontal">
    <fieldset>
     <div class="control-group">
      <label  class="control-label" for="frm_total">随机抽样份数</label>
      <div class="controls">
         <input name="total" id="frm_total" type="text"/>
      </div>
    </div>

 <%== $.View('//docview/ui/views/org.ejs', { label: '理单关区', name : 'org'} ) %>
 <%== $.View('//docview/ui/views/org.ejs', { label: '申报关区', name : 'org_applied'} ) %>

    <div class="control-group">
      <label  class="control-label" for="frm_doctype">进出口种类</label>
      <div class="controls">
      <select id="frm_docType"  name="doc_type" style="width: 80px;">
          <option value="">不限</option>
          <option value="JK">进口</option>
          <option value="CK">出口</option>
      </select> 年限
        <select id="frm_years" name="years" style="width: 80px;">
           <option value="">不限</option>
           <option value="3">3年</option>
           <option value="5">5年</option>
           <option value="11">11年</option>
       </select>
      </div>
 
   </div>

   <div class="control-group">
        <label  class="control-label" for="frm_isMod_or_isTax">业务类型</label>
       <div class="controls">            
            <select id="frm_isMod_or_isTax"  name="isMod_or_isTax" style="width: 80px;">
              <option value="">不限</option>
              <option value="isMod">删改单</option>
              <option value="isTax">退补税</option>
            </select>
        </div>
   </div>

   <div class="control-group daterange-holder"></div>
   <div class="controls">
       <%== $.View('//docview/search/views/filters_form.ejs', {type: "advanced"}) %></div>
</fieldset>

<fieldset>
<div class="row-fluid"> 
    <button type="submit" class="btn btn-primary"><i class="icon-search icon-white"></i><%= $.i18n._('btn.search')  %></button>
</fieldset>
</form>
