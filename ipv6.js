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

module.exports.getIpv4MappedIpv6Address = getIpv4MappedIpv6Address;