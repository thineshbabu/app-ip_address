/*
  Import the ip-cidr npm package.
  See https://www.npmjs.com/package/ip-cidr
  The ip-cidr package exports a class.
  Assign the class definition to variable IPCIDR.
*/
const IPCIDR = require('ip-cidr');

/*
  Import the built-in path module.
  See https://nodejs.org/api/path.html
  The path module provides utilities for working with file and directory paths.
  IAP requires the path module to access local file modules.
  The path module exports an object.
  Assign the imported object to variable path.
*/
const path = require('path');

/**
 * Import helper function module located in the same directory
 * as this module. IAP requires the path object's join method
 * to unequivocally locate the file module.
 */
const { getIpv4MappedIpv6Address } = require(path.join(__dirname, 'ipv6.js'));

/**
 * Calculate and return the first host IP address from a CIDR subnet.
 * @param {string} cidrStr - The IPv4 subnet expressed
 *                 in CIDR format.
 * @param {callback} callback - A callback function.
 * @return {object} (IPV4AndIPV6) - An Object holding the ipv4 and ipv6 addresses.
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
  let IPV4AndIPV6 = {};
  let IPV6Address= null;
 
  if(firstIpAddress != null) {
      IPV6Address = getIpv4MappedIpv6Address(firstIpAddress);
  } else {
      IPV6Address = null;
  }
  IPV4AndIPV6["ipv4"] = firstIpAddress;
  IPV4AndIPV6["ipv6"] = IPV6Address;

  // Call the passed callback function.
  // Node.js convention is to pass error data as the first argument to a callback.
  // The IAP convention is to pass returned data as the first argument and error
  // data as the second argument to the callback function.
  return callback(IPV4AndIPV6, callbackError);
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
      console.log(`  Response returned from GET request: ${JSON.stringify(data)}`);
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