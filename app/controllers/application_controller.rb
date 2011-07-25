class ApplicationController < ActionController::Base
  helper :all
  protect_from_forgery
  layout :detect_browser

private
  TABLET_BROWSERS = ["ipad"]
  MOBILE_BROWSERS = ["android", "ipod", "opera mini", "blackberry", "palm","hiptop","avantgo","plucker", "xiino",
                     "blazer","elaine", "windows ce; ppc;", "windows ce; smartphone;","windows ce; iemobile",
                     "up.browser","up.link","mmp","symbian","smartphone", "midp","wap","vodafone","o2","pocket",
                     "kindle", "mobile","pda","psp","treo"]

  def detect_browser
    agent = request.headers["HTTP_USER_AGENT"].downcase
    TABLET_BROWSERS.each do |t|
      return "tablet_application" if agent.match(t)
    end
    MOBILE_BROWSERS.each do |m|
      return "phone_application" if agent.match(m)
    end
    # return "standard_application"
    return "standard_application"
  end
  
end
