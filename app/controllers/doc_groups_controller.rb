
class DocGroupsController < ApplicationController 

  respond_to :json

  def index
    @doc_groups = DocGroup.where(:user_id => current_user.id)

    @doc_groups.each { |d|
      d.hack_doc_entries_string
    }
    render json: @doc_groups
    #respond_with(@doc_groups)
  end

  def show
    @doc_group = DocGroup.find(params[:id])
    respond_with({:doc_group => @doc_group, :doc_group_entries => @doc_group.doc_group_entries})
  end

  def create
    fullname = params[:name] + '/' + current_user.username
    g = DocGroup.new(:name => fullname, :user_id => current_user.id)
    g.save

    params[:doc_ids].each { |d|
      e = DocGroupEntry.new
      e.doc_id = d
      e.doc_group_id =g.id
      e.save
    }

    g.hack_doc_entries_string
    respond_to do |format|
      format.html
      format.json { render json: { :doc_group => g, :doc_group_entries => g.doc_group_entries }, :status => 200 }
    end
  end

  def update
    @doc_group = DocGroup.find(params[:id])

    DocGroupEntry.delete_all(:doc_group_id => @doc_group.id)
    params[:doc_ids].each { |d|
      e = DocGroupEntry.new
      e.doc_id = d
      e.doc_group_id = @doc_group.id
      e.save
    }

    @doc_group.hack_doc_entries_string
    respond_with({:doc_group => @doc_group, :doc_group_entries => @doc_group.doc_group_entries})
  end


  def destroy
    @doc_group = DocGroup.find(params[:id])
    @doc_group.destroy


    respond_to do |format|
      format.html
      format.json { head :no_content }
    end
  end
end
