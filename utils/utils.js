function getRoundOffValue(price) {
  const absolutePrice = Math.abs(parseFloat(price));
  const roundedPrice = absolutePrice.toFixed(2);
  
  return (parseFloat(roundedPrice) !== 0.00) ? (price >= 0 ? roundedPrice : '-' + roundedPrice) : (price >= 0 ? absolutePrice.toFixed(4) : '-' + absolutePrice.toFixed(4));
}

function convertLargeNumber(number) {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const sign = Math.sign(number);
    const absNumber = Math.abs(number);
    const suffixIndex = Math.max(0, Math.floor(Math.log10(absNumber) / 3));

    const scaledNumber = absNumber / Math.pow(1000, suffixIndex);
    const formattedNumber = scaledNumber.toFixed(2);

    return (sign === -1 ? '-' : '') + formattedNumber + suffixes[suffixIndex];
}


function getLargeNumberPatten(number) {
  const absNumber = Math.abs(number);
  const suffixIndex = Math.max(0, Math.floor(Math.log10(absNumber) / 3));

  return suffixIndex;
}

function formatDateAnalysis(dateString)  {
  const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

function getTimeDifference(pastTimeString) {
  // Convert the past time string to a Date object
  const pastTime = new Date(pastTimeString);

  // Get the current time
  const now = new Date();

  // Calculate the difference in milliseconds
  const differenceMs = now - pastTime;

  // Convert milliseconds to minutes
  const differenceMinutes = Math.floor(differenceMs / (1000 * 60));

  // Convert minutes to hours
  const differenceHours = Math.floor(differenceMinutes / 60);

  // Convert hours to days
  const differenceDays = Math.floor(differenceHours / 24);

  if (differenceDays > 0) {
      return { value: differenceDays, unit: 'days' };
  } else if (differenceHours > 0) {
      return { value: differenceHours, unit: 'hours' };
  } else {
      return { value: differenceMinutes, unit: 'minutes' };
  }
}

function formatPrice(number){
  let fixTwo = parseFloat(number).toFixed(2)
  if(parseFloat(fixTwo) > 0)
    return fixTwo
  else{
    return parseFloat(number).toFixed(4)
  }
}

function emailValidation(email){
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export { getRoundOffValue, convertLargeNumber, formatDateAnalysis, getTimeDifference, formatPrice, getLargeNumberPatten, emailValidation};
