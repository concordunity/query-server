
<div class="row-fluid">
        <div class="span6">
	<fieldset>
<form class="form form-horizontal" >
                <div class="control-group">
	        2012年1-6月查获率为0的重点查验企业             <button type="button" class="find-zero-rate btn btn-primary" ><%= $.i18n._('btn.search')  %></button>
      		<label class="">说明：重点查验企业是指查验率大于一定值的企业</label>
		</div>
</form>
<form class="form form-horizontal" >
                <div class="control-group">
      		2012年1-6月一般贸易进口价格偏低报关单记录       <button type="button" class="normal-import-record btn btn-primary" ><%= $.i18n._('btn.search')  %></button>
     		<label class="">说明：价格偏低记录是指价格低于统计价格高低参数实际下限的报关单记录</label>
		</div>
</form>
<form class="form form-horizontal" >
                <div class="control-group">
      		2012年6月进口通关时间超长报关单               <button type="button" class="import-most-time btn btn-primary" ><%= $.i18n._('btn.search')  %></button> 
     		<label class="">说明：通关时间超长报关单是指剔除递单、缴税时间后，通关作业时间大于15天的报关单</label>
		</div>
</form>
	</fieldset>
        </div>
</div>

<div class="">
  <div id="search_results"></div>
  <div id="second_results"></div>
</div>

