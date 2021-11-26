console.log("Welcome!");

// The goal of this program is to find the largest square full of 1's in a matrix
// If there are multiple squares of the same (largest) size, returns any of them
// Instead of searching through all options (i.e. brute force), I'm going to try to use dynamic programming


// Does not count loops related to printing
var loopCount = 0;


// Using a text-based matrix here to make it easier to change elements

var textMatrix = [
"1110101110101011111",
"1110101110101011111",
"1110101110101011111",
"1110101111111111111",
"1110101111111111111",
"1111111111111111111",
"1111111110111011111",
"1110101110101011111",
"1110101111111111111",
"1110101111111111111",
"1110101111111111111",
"1110101111111111111"
];

// Converting text matrix to integers
function convertTextMatrix(m) {
	var numMatrix = [];
	for (i = 0; i < m.length; i++) {
		var tempList = [...m[i]].map(a => +a);
		numMatrix.push(tempList);
	}
	return numMatrix;
}
var matrix = convertTextMatrix(textMatrix);

function addSpaces(n) {
	var spaces = ""
	for (k = 0; k < n; k++) {
		spaces += " ";
	}
	return spaces;
}

function printer(m) {
	// But what if matrix elements are of different length? This fixes the ugly print:
	var stringM = [];
	var maxLength = 0;
	for (i = 0; i < m.length; i++) {
		var tempList = [];
		for (j = 0; j < m[i].length; j++) {
			var string = m[i][j].toString();
			if (string.length > maxLength) {
				maxLength = string.length;
			}
			tempList.push(string);
		}
		stringM.push(tempList);
	}
	for (i = 0; i < m.length; i++) {
		for (j = 0; j < m[i].length; j++) {
			stringM[i][j] += addSpaces(maxLength - stringM[i][j].length);	
		}
	}
	
	// Printing the now-balanced matrix
	for (i = 0; i < stringM.length; i++) {
		console.log(...stringM[i]);
	}
	console.log("---");
}

printer(matrix);

function incrementer(matrix) {
	m = JSON.parse(JSON.stringify(matrix));

	for (i = 0; i < m.length; i++) {
		loopCount++;
		for (j = 0; j < m[i].length; j++) {
			loopCount++;
			// Inspecting i'th row, j'th element
			var currS = m[i][j];
			if (currS > 0) {

				if (j != m[i].length - 1 &&	// Avoid out-of-bounds
						i != m.length - 1 &&		// Avoid out-of-bounds
						m[i][j + 1] > 0 &&
						m[i + 1][j] > 0 &&
						m[i + 1][j + 1] > 0) {

					// If "connection-case", start sums from the beginning
					if (i != 0 && m[i - 1][j + 1] == 0 && m[i + 1][j - 1] == 0) {
						m[i][j + 1] = 2;
						m[i + 1][j] = 2;
					} else {
						m[i][j + 1] += currS;
						m[i + 1][j] += currS;
					}
				
				} else if (j != 0 &&						// Avoid out-of-bounds
									 i != m.length - 1 &&	// Avoid out-of-bounds
									 m[i][j - 1] > 0 &&
									 m[i + 1][j] > 0 &&
									 m[i + 1][j - 1] > 0) {

					m[i + 1][j] += currS;

				} else if (j != m[i].length &&	// Avoid out-of-bounds
									 i != 0 &&						// Avoid out-of-bounds
									 m[i][j + 1] > 0 &&
									 m[i - 1][j] > 0 &&
									 m[i - 1][j + 1] > 0) {

					m[i][j + 1] += currS;

				}
			}
		}
	}
	printer(m);
	return m;
}

// Sort all cumulative sums so that the squares can be verified starting from the largest one
// Returns list of [sum, row, column]
function sortSums(m) {
	var listall = [];
	for (i = 0; i < m.length; i++) {
		loopCount++;
		for (j = 0; j < m[i].length; j++) {
			loopCount++;
			listall.push([m[i][j], i, j]);
		}
	}
	listall.sort(function(a, b) {
		return b[0] - a[0]
	});
	//console.log(listall);
	return listall;
}

// This could be done more efficiently, because it doesn't utilize already calculated values
function genCornerSums(m, largestSum) {
	// Max side length for a square is the shortest dimension of the matrix
	//var n = Math.min(m.length, m[0].length);
	// Side length that cannot be exceeded with the largest gotten corner sum
	// Note, however, that sometimes corner sum exceeds what the largest square in a matrix could produce
	var n = Math.min(Math.ceil(Math.log(largestSum) / Math.log(3)), m.length, m[0].length);
	//n = 9;
	console.log("n: " + n);
	var list = [5];
	var calls = 0;

	function inner(arr) {
		calls++;
		arr.splice(1, 1, arr[0] + arr[1] + 1);
		for (i = 2; i < arr.length; i++) {
			loopCount++;
			arr.splice(i, 1, arr[i] + arr[i - 1] + 1);
		}
		var cSum = arr[arr.length - 1] * 2 + 1;
		list.push(cSum);
		if (calls > n - 3) {
			return;
		}
		arr.splice(0, 1, arr[0] + 1);
		arr.push(cSum);
		inner(arr)
	}
	inner([3, 5]);

	console.log("Recursive calls: " + calls);
	return list;
}

// Check the validity of a square, ie. whether none of the slots is 0
// Params: side lenght, row & column (of the bottom right corner)
function checkSquare(n, row, col) {
	for (i = row; i > row - n; i--) {
		loopCount++;
		for (j = col; j > col - n; j--) {
			loopCount++;
			//console.log("i, j: " + i + ", " + j);
			if (incM[i][j] == 0) {
				//console.log("The square is not valid.");
				return false;
			}
		}
	}
	//console.log("The square is valid!");
	return true;
}

// Go through all sums, and give the first valid square (which is largests since sums are sorted)
function findLargestSquare() {
	// Side length (ie. size), row, col
	var largestFoundSquare = [0, 0, 0];
	for (k = 0; k < listAll.length; k++) {
		loopCount++;
		//console.log(listAll[k][0]);
		// With given sum, what is the maximum size of the square? Returns length of a side (n)
		var n = cornerSums.findIndex((a) => a > listAll[k][0]) + 1;
		// As mentioned before, sometimes cSum exceeds what is possible within the matrix
		// In such case, the index is not found, and we give the largest possible n size
		if (n <= 0) {
			n = cornerSums.length + 1;
		}

		var row = listAll[k][1];
		var col = listAll[k][2];

		// If starting from this k the largest possible square is the same as what we've found, then end
		if (n == largestFoundSquare[0]) {
			console.log("No larger squares available anymore.");
			endScreen(largestFoundSquare[0], largestFoundSquare[1], largestFoundSquare[2])
			return;
		}

		// Check multiple sized squares starting from the same corner
		for (l = n; l > largestFoundSquare[0]; l--) {
			loopCount++;
			//console.log("l: " + l);
			var check = checkSquare(l, row, col);
			if (check) {
				// If the found square is as large as possible with the given sum
				if (l == n) {
					endScreen(n, row, col);
					return;
				// If the found square is not maximum sized with the given sum, then save the result and try to find a larger square
				} else if (l > largestFoundSquare[0]) {
					largestFoundSquare = [l, row, col];
					break;
				}
			}
		}
		//console.log("largestFoundSquare: " + largestFoundSquare);
	}
}

function endScreen(n, i, j) {
	console.log("The algorithm found the largest square of 1's in the matrix:");
	console.log("Size: " + n + "x" + n);
	console.log("Location (bottom right corner): (" + i + ", " + j + ")");
	console.log("The program made " + loopCount + " loops.");
}


// METHOD 2 STARTING FROM HERE
function incrementer2(matrix) {
	m = JSON.parse(JSON.stringify(matrix));
	// Size length, i, j
	var currLargest = [0, 0, 0];

	// No need to check the first row -> i = 1
	for (i = 1; i < m.length; i++) {
		loopCount++;
		// No need to check the first column -> j = 1
		for (j = 1; j < m[i].length; j++) {
			loopCount++;
			if (m[i][j] != 0) {
				// The smallest number on left/top/top-left dictates the max size of this square
				m[i][j] += Math.min(m[i - 1][j], m[i][j - 1], m[i - 1][j - 1]);
				// Keep track of the largest square so far
				// => No need to iterate through everything in the end again
				if (m[i][j] > currLargest[0]) {
						currLargest = [m[i][j], i, j];
				}
			}
		}
	}
	printer(m);
	endScreen(currLargest[0], currLargest[1], currLargest[2]);
}


// Choose solving method:
// Fully dynamic = 1
// Semi-dynamic != 1

var method = 1;

if (method == 1) {
	incrementer2(matrix)
} else {
	var incM = incrementer(matrix);
	var listAll = sortSums(incM);
	var cornerSums = genCornerSums(matrix, listAll[0][0]);
	console.log(cornerSums);
	findLargestSquare();
}




// Unused, less effective recursion:

	/*
	function inner(side, top) {
		count++;
		//console.log("side: " + side + ", top: " + top);
		if (side == 1) {
			return top;
		}
		if (top == 1) {
			return side;
		}
		// This is not even needed :D
		
		//if (side == 2 && top == 2) {
		//	return 5;
		//}
		

		// If I didn't have to record sub-solutions I could've simply used this & return sum
		//var sum = inner(side - 1, top) + inner(side, top - 1) + 1;

		var a = inner(side - 1, top)
		var b = inner(side, top - 1)
		var sum = a + b + 1;

		if (a == b && !list.includes(sum)) {
			list.push(sum);
		}
		//console.log("SUM: " + sum);
		// If I don't have a return statement, then it returns NaN
		return sum;
	}
	*/

	//inner(n, n);