/*
  Import the ip-cidr npm package.
  See https://www.npmjs.com/package/ip-cidr
  The ip-cidr package exports a class.
  Assign the class definition to variable IPCIDR.
*/
const IPCIDR = require('ip-cidr');

/**
 * Calculate and return the first host IP address from a CIDR subnet.
 * @param {string} cidrStr - The IPv4 subnet expressed
 *                 in CIDR format.
 * @param {callback} callback - A callback function.
 * @return {string} (firstIpAddress) - An IPv4 address.
 */
function getFirstIpAddress(cidrStr, callback) {

  // Initialize return arguments for callback
  let firstIpAddress = null;
  let callbackError = null;

  // Instantiate an object from the imported class and assign the instance to variable cidr.
  const cidr = new IPCIDR(cidrStr);
  // Initialize options for the toArray() method.
  // We want an offset of one and a limit of one.
  // This returns an array with a single element, the first host address from the subnet.
  const options = {
    from: 1,
    limit: 1
  };

  // Use the object's isValid() method to verify the passed CIDR.
  if (!cidr.isValid()) {
    // If the passed CIDR is invalid, set an error message.
    callbackError = 'Error: Invalid CIDR passed to getFirstIpAddress.';
  } else {
    // If the passed CIDR is valid, call the object's toArray() method.
    // Notice the destructering assignment syntax to get the value of the first array's element.
    [firstIpAddress] = cidr.toArray(options);
  }
  // Call the passed callback function.
  // Node.js convention is to pass error data as the first argument to a callback.
  // The IAP convention is to pass returned data as the first argument and error
  // data as the second argument to the callback function.
  return callback(firstIpAddress, callbackError);
}

/**
 * Calculates an IPv4-mapped IPv6 address.
 * @param {string} ipv4 - An IPv4 address in dotted-quad format.
 * @return {*} (ipv6Address) - An IPv6 address string or null if a run-time problem was detected.
 */
function getIpv4MappedIpv6Address(ipv4) {

  // Initialize return argument
  let ipv6Address = null;

  // Prepare to derive a Hex version of the dotted-quad decimal IPv4 address.
  // Split the IPv4 address into its four parts.
  let ipv4Quads = ipv4.split('.');
  // Count the number of parts found.
  let numIpv4Segments = ipv4Quads.length;

  // Verify IPv4 had four parts.
  if (numIpv4Segments === 4) {
    let validQuads = true;
    // Iterate over the IPv4 address parts and verify each segment was a number between 0 and 255.
    for(let i=0; i < numIpv4Segments; i++) {
      if( isNaN(Number(ipv4Quads[i])) || ipv4Quads[i] < 0 || ipv4Quads[i] > 255 ) {
        validQuads = false;
      }
    }
    // Passed IPv4 is valid. Now to derive an IPv4-mapped IPv6 address.
    if (validQuads) {
      // Hardcode the prefix. During refactor, we might want to make the prefix a const.
      ipv6Address = "0:0:0:0:0:ffff:";
      // Iterate over the IPv4 parts
      for(let i=0; i < numIpv4Segments; i++) {
        // Convert part to an integer, then convert to a hex string using method toString()
        // with a base 16 (hex) encoding.
        let hexString = parseInt(ipv4Quads[i]).toString(16);
        // If hex is odd (single digit), prepend a '0'. This is why we wanted to work with a string.
        if (hexString.length % 2)
          hexString = '0' + hexString;
        // Append hex part to evolving variable ipv6Address.
        ipv6Address = ipv6Address + hexString;
        // Add a colon to split the encoded address and match the IPv6 format.
        if(i===1) {
          ipv6Address = ipv6Address + ':';
        }
      }
    }
  }
  return ipv6Address;
}


/*
  This section is used to test function and log any errors.
  We will make several positive and negative tests.
*/
function main() {
  // Create some test data for getFirstIpAddress(), both valid and invalid.
  let sampleCidrs = ['172.16.10.0/24', '172.16.10.0 255.255.255.0', '172.16.10.128/25', '192.168.1.216/30'];
  let sampleCidrsLen = sampleCidrs.length;
  // Create some test data for getIpv4MappedIpv6Address, both valid and invalid.
  let sampleIpv4s = [ '172.16.10.1', '172.16.10.0/24', '172.16.10.0 255.255.255.0', '172.16.256.1', '1.1.1.-1'];
  let sampleIpv4sLen = sampleIpv4s.length;

  // Iterate over sampleCidrs and pass the element's value to getFirstIpAddress().
  for (let i = 0; i < sampleCidrsLen; i++) {
    console.log(`\n--- Test Number ${i + 1} getFirstIpAddress(${sampleCidrs[i]}) ---`);
    // Call getFirstIpAddress and pass the test subnet and an anonymous callback function.
    // The callback is using the fat arrow operator: () => { }
    getFirstIpAddress(sampleCidrs[i], (data, error) => {
      // Now we are inside the callback function.
      // Display the results on the console.
      if (error) {
        console.error(`  Error returned from GET request: ${error}`);
      }
      console.log(`  Response returned from GET request: ${data}`);
    });
  }
  // Iterate over sampleIpv4s and pass the element's value to getIpv4MappedIpv6Address().
  for (let i = 0; i < sampleIpv4sLen; i++) {
    console.log(`\n--- Test Number ${i + 1} getIpv4MappedIpv6Address(${sampleIpv4s[i]}) ---`);
    // Assign the function results to a variable so we can check if a string or null was returned.
    let mappedAddress = getIpv4MappedIpv6Address(sampleIpv4s[i]);
    if( mappedAddress ) {
      console.log(`  IPv4 ${sampleIpv4s[i]} mapped to IPv6 Address: ${mappedAddress}`);
    } else {
      console.error(`  Problem converting IPv4 ${sampleIpv4s[i]} into a mapped IPv6 address.`);
    }
  }
}

/*
  Call main to run it.
*/
main();