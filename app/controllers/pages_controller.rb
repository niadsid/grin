class PagesController < ApplicationController
  def home
    @title = "Welcome!"
  end
  
  def issues
    @title = "Issues List"
  end
end