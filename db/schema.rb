# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110711210924) do

  create_table "addresses", :force => true do |t|
    t.string   "network_address"
    t.integer  "mask_length"
    t.string   "description"
    t.string   "address_type"
    t.integer  "subnet_id"
    t.string   "interface"
    t.string   "system"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "url"
  end

  create_table "networks", :force => true do |t|
    t.string   "network_name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "tree_id"
  end

  create_table "sites", :force => true do |t|
    t.string   "site_name"
    t.integer  "network_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "tree_id"
  end

  create_table "subnets", :force => true do |t|
    t.string   "subnet_name"
    t.string   "subnet_identifier"
    t.string   "mask_length"
    t.string   "default_router"
    t.string   "description"
    t.integer  "site_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "tree_id"
  end

  create_table "translations", :force => true do |t|
    t.integer  "address_id"
    t.integer  "source_port"
    t.string   "destination_address"
    t.integer  "destination_port"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
