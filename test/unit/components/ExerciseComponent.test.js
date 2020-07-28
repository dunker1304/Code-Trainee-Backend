const { expect } = require('chai')
const ExerciseComponent = require('../../../api/components/ExerciseComponent')

describe('ExerciseComponent', () => {
  it('Submit Exercise 1', (done) => {
    ExerciseComponent.submitExercise({
      language_id: 63,
      source_code: `console.log('a')`,
      stdin: '1',
      expected_output: 'a',
    })
    .then(result => {
      expect(result.success).to.equal(true)
      expect(result.data.status.description).to.equal('Accepted')
      done();
    })
  })

  it('Submit Exercise 2', (done) => {
    ExerciseComponent.submitExercise({
      language_id: 62,
      source_code: `import java.io.*;
      import java.math.*;
      import java.text.*;
      import java.util.*;
      import java.util.regex.*;
      public class Main {
          static int simpleArraySum(int[] ar) {
              int count = 0; 
              for ( int i =0 ; i< ar.length ; i++ ){
                  count+=ar[i];
              }
              return count;
          }
          private static final Scanner scanner = new Scanner(System.in);
          public static void main(String[] args) throws IOException {
              int arCount = Integer.parseInt(scanner.nextLine().trim());
              int[] ar = new int[arCount];
              String[] arItems = scanner.nextLine().split(" ");
              for (int arItr = 0; arItr < arCount; arItr++) {
                  int arItem = Integer.parseInt(arItems[arItr].trim());
                  ar[arItr] = arItem;
              }
              int result = simpleArraySum(ar);
              System.out.print(result);
          }
      }`,
      stdin: `5\n1 2 3 4 5`,
      expected_output: '15',
    })
    .then(result => {
      expect(result.success).to.equal(true)
      expect(result.data.status.description).to.equal('Accepted')
      done();
    })
  })

})