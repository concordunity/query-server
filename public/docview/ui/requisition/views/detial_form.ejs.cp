<tr >
<td colspan='7' style="border:2px solid #cccc00;"   >
	
<form onsubmit="return false;">
<legend>详细信息</legend>
<table class="table table-condensed table-striped"   >
<tr>
	<td>申请人员:</td>
	<td><%= model.apply_staff %></td>
	<td>申请日期:</td>
	<td><%= model.created_at %></td>
</tr>
<tr>
	<td>电话号码:</td>
	<td><%= model.tel %></td>
	<td>关区及科室:</td>
	<td><%= model.department_name +" "+ orgJsonDictionary[model.org]  %>  </td> 
</tr>
<tr>
	<td>状态:</td>
	<td><%= scene_lent_paper_documentJsonDictionary[model.status.toString()] %></td>
	<td>终结说明:</td>
	<td><%= model.termination_instructions %></td>
</tr>
<tr>
<td colspan="4">
<div class="well"  >
<table class="table " >
		<caption><legend>抽单信息</legend></caption>
		<tr>
			<th>单证号码</th>
			<th>随附文档</th>
			<th>所在页码</th>
			<th>借出原因</th>
		</tr>
	<tbody>
	<% for(var j = 0; j < model.requisition_details.length; j++) { %>
		<tr>
			<td><span class="label"><%= model.requisition_details[j].single_card_number%></span></td>
			<td><%= model.requisition_details[j].modify_accompanying_documents%></td>
			<td><%= model.requisition_details[j].where_page %></td>
			<td><%= model.requisition_details[j].lent_reasons %></td>
		</tr>
	<% } %>
	</tbody>
</table>
</div>
</td>
</tr>
<tr>
	<td>审核人员:</td>
	<td><%= model.approving_officer %></td>
	<td>审核时间:</td>
	<td><%= model.approval_time %></td>
</tr>
<tr>
	<td>登记人员:</td>
	<td><%= model.registration_staff %></td>
	<td>登记时间:</td>
	<td><%= model.check_in_time %></td>
</tr>

<tr>
	<td>核销人员:</td>
	<td><%= model.write_off_staff %></td>
	<td>核销时间:</td>
	<td><%= model.write_off_time %></td>
</tr>
</table>
	<br />
	<% var btn_behavior = {
		approval: [ 1 ],
		register: [ 2 ],
		write_off:[ 3 ],
	}; %>
	<% if( !$.inArray(model.status , btn_behavior[action]) ){ %>
		<button class="btn btn-primary btn-accept">通过</button>
		<button class="btn btn-danger btn-reject" data-toggle="popover" data-original-title="拒绝" data-content="请填写拒绝理由:" >拒绝</button>
	<% } %>
	<% if("application" == action && model.status == 1){ %>
		<button class="btn btn-revocation">撤销申请</button>
	<% } %>
	<button class="btn btn-info btn-print">打印</button>
	<button class="btn btn-cancel">取消</button>
</form>
</td>
</tr>
