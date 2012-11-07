class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    user ||= User.new # guest user (not logged in)
    if user.admin?
       can :manage, :all
    end



    if !user.web_links.empty?
      user.web_links.each do |w|
        can w.action.to_sym, w.controller.to_sym
        can w.action.to_sym, Document
        can w.action.to_sym, ModifiedDocument

        if (w.action == 'multi_query' || w.action == 'search_docs')
          can :query, Document
          can :query, ModifiedDocument
        end

        if (w.action == 'print' || w.action == 'testify')
          can :print, Document
          can :print_doc, Document
          can :query, Document
        end

        if (w.action == 'by_doc_source')
          can :list_doc_sources, Document
        end

      end
    end

    #
    # The first argument to `can` is the action you are giving the user permission to do.
    # If you pass :manage it will apply to every action. Other common actions here are
    # :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on. If you pass
    # :all it will apply to every resource. Otherwise pass a Ruby class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details: https://github.com/ryanb/cancan/wiki/Defining-Abilities
  end
end
