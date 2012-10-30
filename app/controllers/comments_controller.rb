# -*- coding: utf-8 -*-
class CommentsController < ApplicationController 
  
  respond_to :json

  @@pageType = {
    1 => "合同",
    2 => "发票",
    3 => "装箱清单",
    4 => "提（运）单",
    5 => "代理报关授权委托协议书",
    6 => "进出口打印报关单", 
    7 => "进出口手填报关单",
    8 => "原进出口货物报关单复印件（索赔时提供）",
    9 => "入境货物通关单",
    10 => "进出口货物征免税证明",
    11 => "各种税费的海关专用缴纳书",
    12 => "海关查验通知书",
    13 => "海关货物查验记录单",
    14 => "货物暂时进出境相关单证", 
    15 => "进出口货物报关单修改撤销相关单证",
    16 => "海关价格审核相关单证",
    17 => "进出口税款保证金相关单证", 
    18 => "海关交（付）款通知书",
    19 => "海关提货单",
    20 => "委托代理合同",
    21 => "原产地证明",
    22 => "固体废物进口许可证",
    23 => "自动进口许可证",
    41 => "进口货物直接退运相关单证",
    42 => "海关滞报金缴款通知",
    43 => "海关进出口货物化验鉴定相关单证",
    44 => "价格专业认定书",
    45 => "归类相关单证",
    46 => "情况说明书",
    47 => "商品样品及照片",
    48 => "进口许可证", 
    49 => "两用物项和技术进口许可证",
    50 => "出/入境货物通关单（毛坯钻石用）",
    51 => "濒危物种允许进口证明书", 
    52 => "精神药物进(出)口准许证",
    53 => "黄金及其制品进出口准许证或批件",
    54 => "药品进出口准许证", 
    55 => "密码产品和设备进口许可证",
    56 => "进口药品通关单",
    57 => "进口兽药通关单",
    58 => "进出口农药登记证明", 
    59 => "银行调运现钞进出境许可证",
    60 => "合法捕捞产品通关证明",
    61 => "麻醉药品进出口准许证", 
    62 => "有毒化学品环境管理放行通知单",
    63 => "音像制品进口批准单或节目提取单",
    64 => "内销征税联系单",
    65 => "关税配额外优惠税率进口棉花配额证",
    66 => "国别关税配额证明",
    67 => "适用ITA税率的商品用途认定证明", 
    68 => "关税配额证明",
    68 => "人类遗传资源材料出口、出境证明",
    70 => "非《进出口野生动植物种商品目录》物种证明",
    71 => "民用爆炸物品进口审批单",
    72 => "技术进口合同登记证",
    73 => "高新技术出口确认证明",
    74 => "医疗用毒性药品进出口批件", 
    75 => "放射性药品进出口批件",
    76 => "援外物资批准文件",
    77 => "掏箱作业单",
    78 => "案件线索移送单",
    79 => "准予办理减免税货物税款担保证明",
    80 => "准予办理减免税货物税款担保延期证明",
    81 => "进口货物原产资格申明",
    82 => "退税申请书",
    83 => "收入退还书",
    84 => "进出口货物原产地补充申报单",
    85 => "海关补征税款告知书", 
    86 => "退运货物的商品品质鉴定证书",
    99 => "其他需向海关递交的单证"
  }

  # doc_id must be provided.
  # By default, it returns all comments for a documents.
  # if type is provided,
  def get
    doc_id = params[:doc_id]
    
    if doc_id.blank?
      comments = DocComment.order("doc_id, page")
    else
      comments = DocComment.where(:doc_id => doc_id).order("page")
    end
    render json: comments

  end

  def commit
    json_text = params[:json_text]
    doc_id = params[:doc_id]
    is_regular = params[:is_mod].blank?

    tmp_file = "#{Rails.root}/tmp/xxx.json"
    File.open(tmp_file, 'wb') do |f|
      f.write json_text
    end

    # Sanity check. Make sure the directory exists
    script_file = File.expand_path('~/bin/process_json.sh')
    
    if is_regular
      logger.info("#{script_file} #{doc_id} #{tmp_file}")
      system("#{script_file} #{doc_id} #{tmp_file}")
    else
      m = ModifiedDocument.find_by_doc_id(doc_id)
      if m
        folder = m.folder_id
        system("#{script_file} #{folder_id} #{doc_id} #{tmp_file}")
      end
    end
    head :no_content

  end


  def create_page_type
    c = DocComment.new
    c.doc_id = params[:doc_id]
    c.code = 1
    c.subcode = params[:subcode]
    c.page = params[:page]
    c.commenter = current_user.username
    c.info = @@pageType[c.subcode]
    c.save
    render json: c
  end
  
  def delete_page_type
    DocComment.where({:doc_id => params[:doc_id],
                       :page => params[:page]}).each {
      |d|
      d.delete()
    }
    head :no_content
  end
end
