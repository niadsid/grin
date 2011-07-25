require 'test_helper'

class BackupFilesControllerTest < ActionController::TestCase
  setup do
    @backup_file = backup_files(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:backup_files)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create backup_file" do
    assert_difference('BackupFile.count') do
      post :create, :backup_file => @backup_file.attributes
    end

    assert_redirected_to backup_file_path(assigns(:backup_file))
  end

  test "should show backup_file" do
    get :show, :id => @backup_file.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @backup_file.to_param
    assert_response :success
  end

  test "should update backup_file" do
    put :update, :id => @backup_file.to_param, :backup_file => @backup_file.attributes
    assert_redirected_to backup_file_path(assigns(:backup_file))
  end

  test "should destroy backup_file" do
    assert_difference('BackupFile.count', -1) do
      delete :destroy, :id => @backup_file.to_param
    end

    assert_redirected_to backup_files_path
  end
end
