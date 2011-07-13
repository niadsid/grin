Grin::Application.routes.draw do

  root :to => "pages#home"
  
  match 'addresses/view_all', :to => 'addresses#view_all'
  match 'addresses/view_by_network', :to => 'addresses#view_by_network'
  match 'addresses/view_by_site', :to => 'addresses#view_by_site'
  match 'addresses/view_by_subnet', :to => 'addresses#view_by_subnet'
  match 'addresses/tree', :to => 'addresses#tree'
  match 'addresses/dbaction_tree', :to => 'addresses#dbaction_tree'
  match 'addresses/dbaction_all', :to => 'addresses#dbaction_all'
  match 'addresses/dbaction_network', :to => 'addresses#dbaction_network'
  match 'addresses/dbaction_site', :to => 'addresses#dbaction_site'
  match 'addresses/dbaction_subnet', :to => 'addresses#dbaction_subnet'
  
  match 'subnets/view_all', :to => 'subnets#view_all'
  match 'subnets/view_by_network', :to => 'subnets#view_by_network'
  match 'subnets/view_by_site', :to => 'subnets#view_by_site'
  match 'subnets/view_by_subnet', :to => 'subnets#view_by_subnet'
  match 'subnets/dbaction_all', :to => 'subnets#dbaction_all'
  match 'subnets/dbaction_network', :to => 'subnets#dbaction_network'
  match 'subnets/dbaction_site', :to => 'subnets#dbaction_site'
  match 'subnets/dbaction_subnet', :to => 'subnets#dbaction_subnet'

  resources :translations

  resources :addresses

  resources :subnets

  resources :sites

  resources :networks
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => "welcome#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
