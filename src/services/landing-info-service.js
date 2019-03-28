import config from '../config'

const LandingInfoService = {
  saveVisitHistoryStatus() {
    window.localStorage.setItem(config.VISIT_STATUS, true);
  },
  getVisitHistoryStatus() {
    return window.localStorage.getItem(config.VISIT_STATUS);
  }
}

export default LandingInfoService;