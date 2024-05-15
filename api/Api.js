import config from '../config/config';
const env = "dev";
const apiKey = 'IYRP8hE4678HXt5WcePBr8DJEDgTMLVr4ugQsQMs'
export default class Api {
  static async getStockSummary(symbol, token, mail) {
    return await fetchData(`search/api/v1/stockSummary?ticker=${symbol}&email=${mail}`, token);
  }

  static async getStockHistoricalData(ticker, period, token) {
    return await fetchData(`search/api/v1/stock-historical-data?ticker=${ticker}&period=${period}`, token);
  }

  static async getTrendingStockData(token, mail) {
    return await fetchData(`search/api/v1/getTrendingMarketExchangeList?email=${mail}`, token);
  }

  static async getETFStocks(ticker, token, mail) {
    return await fetchData(`search/api/v1/etf-summary?ticker=${ticker}&email=${mail}`, token);
  }

  static async getStockSearch(ticker,limit,token,mail) {
    return await fetchData(`search/api/v1/stockSearch?ticker=${ticker}&limit=${limit}&email=${mail}`, token);
  }

  static async getNewsByCategory(category, token) {
    return await fetchData(`get_news?category=${category}`, token);
  }
  
  static async getNewsBySymbol(symbol, token) {
    return await fetchData(`get_news?symbol=${symbol}`, token);
  }

  static async getTopEarningStocks(token, mail, category) {
    return await fetchData(`get_top_earning_stocks?email=${mail}&category=${category}`, token);
  }

  static async getMyWatchList(token, mail) {
    return await fetchData(`get_watchlist?email=${mail}`, token);
  }

  static async getWatchListBySymbol(token, mail, symbol) {
    return await fetchData(`get_watchlist?email=${mail}&watchlist=${symbol}`, token);
  }

  static async getTopGainerStocks(token, mail, date){
    return await fetchData(`get_top_gainer_stocks?email=${mail}&date=${date}`, token)
  }

  static async addWatch(token, data) {
    return await putData(`profile_step3`, token, data);
  }

  static async signUp(data) {
    return await putDataWithoutToken(`search/stock-service-dev-signup`, data);
  }

  static async signIn(data) {
    return await putDataWithoutToken(`search/stock-service-dev-signin`, data);
  }

  static async signConfirm(data) {
    return await putDataWithoutToken(`search/stock-service-dev-confirmsignup`, data);
  }

  static async profileFirst(url, data){
    return await putDataWithoutToken(`${url}`, data);
  }

  static async forgotPassword(data) {
    return await putDataWithoutToken(`search/stock-service-dev-sendforgotpassword`, data);
  }

  static async closeAccount(data) {
    return await putDataWithoutToken(`search/stock-service-dev-closeaccount`, data);
  }

  static async confirmPassword(data) {
    return await putDataWithoutToken(`search/stock-service-dev-confirmforgotpassword`, data);
  }

  static async sendMail(data){
    return await putDataWithXApiKey(`mail`, data);
  }

  static async updateAttributes(data){
    return await putDataWithoutToken(`search/stock-service-dev-updateattributes`, data);
  }

  static async getPresignedURI(data){
    return await putDataWithoutToken(`search/stock-service-dev-getsigneduri`, data);
  }
}

const putDataWithXApiKey = (url,params) => {
  let baseURL = config[env].API_URL;
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(params)
    };

    fetch(baseURL + url, requestOptions)
    .then((response) => {
      resolve(response.json());
    });
  })
}

const putDataWithoutToken = (url,params) => {
  let baseURL = config[env].API_URL;
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    };

    fetch(baseURL + url, requestOptions)
    .then((response) => {
      resolve(response.json());
    });
  })
}

const putData = (url, token, params) => {
  let baseURL = config[env].API_URL;
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer  ${token}` 
      },
      body: JSON.stringify(params)
    };

    fetch(baseURL + url, requestOptions)
    .then((response) => {
      resolve(response.json());
    });
  })
}

const fetchData = (url, token) => {
  let baseURL = config[env].API_URL;
  return new Promise((resolve, reject) => {
    fetch(baseURL + url, {
      headers: {
        Authorization: `Bearer  ${token}`
      }
    }).then((response) => {
      if(response.status == 200)
        resolve(response.json());
      else
        reject("Network error")
    })
  });
};
