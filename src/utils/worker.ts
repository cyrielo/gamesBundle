import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

/**
 * Basic HTML5 template to use if the file is empty.
 */

const dailyCommitsRand = [18, 4, 31, 25, 27, 5, 7, 18, 16, 5, 25, 23, 31, 30, 20, 0, 18, 15, 2, 26, 25, 30, 5, 11, 10, 24, 15, 28, 29, 21, 23, 12, 14, 16, 29, 15, 8, 0, 3, 24, 2, 23, 25, 10, 11, 6, 3, 1, 6, 15, 15, 0, 20, 22, 9, 14, 0, 14, 3, 17, 7, 14, 6, 25, 16, 3, 5, 5, 14, 14, 31, 6, 6, 19, 26, 23, 25, 15, 24, 24, 11, 18, 15, 16, 23, 27, 15, 12, 1, 30, 18, 28, 22, 2, 11, 21, 24, 24, 22, 22, 5, 22, 2, 23, 19, 19, 12, 18, 14, 12, 5, 11, 20, 15, 12, 18, 10, 10, 2, 15, 9, 0, 3, 15, 3, 30, 9, 18, 31, 13, 0, 27, 17, 8, 28, 13, 20, 8, 18, 28, 0, 16, 26, 5, 26, 23, 3, 16, 4, 6, 12, 0, 18, 13, 10, 23, 2, 14, 9, 18, 5, 29, 7, 6, 8, 8, 6, 0, 19, 20, 31, 5, 6, 14, 14, 8, 31, 30, 24, 8, 15, 5, 8, 8, 10, 20, 18, 16, 21, 4, 7, 28, 30, 30, 16, 27, 5, 13, 19, 15, 20, 30, 20, 12, 23, 13, 5, 15, 3, 6, 26, 19, 29, 3, 30, 6, 21, 19, 8, 14, 7, 0, 25, 26, 28, 1, 13, 17, 31, 30, 25, 21, 14, 8, 26, 31, 5, 2, 8, 27, 27, 9, 4, 29, 28, 14, 15, 4, 18, 20, 27, 30, 25, 19, 0, 25, 25, 26, 9, 25, 13, 7, 15, 0, 0, 0, 31, 2, 8, 28, 29, 4, 4, 7, 22, 2, 4, 8, 8, 21, 14, 29, 22, 14, 27, 20, 1, 22, 10, 30, 5, 1, 27, 15, 4, 14, 3, 15, 6, 9, 3, 8, 23, 2, 21, 4, 14, 22, 0, 30, 20, 26, 20, 5, 24, 8, 30, 2, 26, 4, 27, 26, 27, 22, 28, 5, 0, 18, 11, 1, 25, 19, 29, 4, 0, 1, 30, 11, 10, 25, 4, 30, 26, 15, 15, 9, 31, 22, 13, 28, 29, 21, 5, 2, 23, 14, 5, 22, 15, 7, 16, 31, 9, 8, 16, 9, 14, 5, 6, 7, 20, 19, 4, 8, 12, 4, 19, 3, 8, 5, 0, 22, 9, 2, 30];
const commitDates = ["2024-01-28T00:00:00", "2024-01-29T00:00:00", "2024-01-30T00:00:00", "2024-01-31T00:00:00", "2024-02-01T00:00:00", "2024-02-02T00:00:00", "2024-02-03T00:00:00", "2024-02-04T00:00:00", "2024-02-05T00:00:00", "2024-02-06T00:00:00", "2024-02-07T00:00:00", "2024-02-08T00:00:00", "2024-02-09T00:00:00", "2024-02-10T00:00:00", "2024-02-11T00:00:00", "2024-02-12T00:00:00", "2024-02-13T00:00:00", "2024-02-14T00:00:00", "2024-02-15T00:00:00", "2024-02-16T00:00:00", "2024-02-17T00:00:00", "2024-02-18T00:00:00", "2024-02-19T00:00:00", "2024-02-20T00:00:00", "2024-02-21T00:00:00", "2024-02-22T00:00:00", "2024-02-23T00:00:00", "2024-02-24T00:00:00", "2024-02-25T00:00:00", "2024-02-26T00:00:00", "2024-02-27T00:00:00", "2024-02-28T00:00:00", "2024-02-29T00:00:00", "2024-03-01T00:00:00", "2024-03-02T00:00:00", "2024-03-03T00:00:00", "2024-03-04T00:00:00", "2024-03-05T00:00:00", "2024-03-06T00:00:00", "2024-03-07T00:00:00", "2024-03-08T00:00:00", "2024-03-09T00:00:00", "2024-03-10T00:00:00", "2024-03-11T00:00:00", "2024-03-12T00:00:00", "2024-03-13T00:00:00", "2024-03-14T00:00:00", "2024-03-15T00:00:00", "2024-03-16T00:00:00", "2024-03-17T00:00:00", "2024-03-18T00:00:00", "2024-03-19T00:00:00", "2024-03-20T00:00:00", "2024-03-21T00:00:00", "2024-03-22T00:00:00", "2024-03-23T00:00:00", "2024-03-24T00:00:00", "2024-03-25T00:00:00", "2024-03-26T00:00:00", "2024-03-27T00:00:00", "2024-03-28T00:00:00", "2024-03-29T00:00:00", "2024-03-30T00:00:00", "2024-03-31T00:00:00", "2024-04-01T00:00:00", "2024-04-02T00:00:00", "2024-04-03T00:00:00", "2024-04-04T00:00:00", "2024-04-05T00:00:00", "2024-04-06T00:00:00", "2024-04-07T00:00:00", "2024-04-08T00:00:00", "2024-04-09T00:00:00", "2024-04-10T00:00:00", "2024-04-11T00:00:00", "2024-04-12T00:00:00", "2024-04-13T00:00:00", "2024-04-14T00:00:00", "2024-04-15T00:00:00", "2024-04-16T00:00:00", "2024-04-17T00:00:00", "2024-04-18T00:00:00", "2024-04-19T00:00:00", "2024-04-20T00:00:00", "2024-04-21T00:00:00", "2024-04-22T00:00:00", "2024-04-23T00:00:00", "2024-04-24T00:00:00", "2024-04-25T00:00:00", "2024-04-26T00:00:00", "2024-04-27T00:00:00", "2024-04-28T00:00:00", "2024-04-29T00:00:00", "2024-04-30T00:00:00", "2024-05-01T00:00:00", "2024-05-02T00:00:00", "2024-05-03T00:00:00", "2024-05-04T00:00:00", "2024-05-05T00:00:00", "2024-05-06T00:00:00", "2024-05-07T00:00:00", "2024-05-08T00:00:00", "2024-05-09T00:00:00", "2024-05-10T00:00:00", "2024-05-11T00:00:00", "2024-05-12T00:00:00", "2024-05-13T00:00:00", "2024-05-14T00:00:00", "2024-05-15T00:00:00", "2024-05-16T00:00:00", "2024-05-17T00:00:00", "2024-05-18T00:00:00", "2024-05-19T00:00:00", "2024-05-20T00:00:00", "2024-05-21T00:00:00", "2024-05-22T00:00:00", "2024-05-23T00:00:00", "2024-05-24T00:00:00", "2024-05-25T00:00:00", "2024-05-26T00:00:00", "2024-05-27T00:00:00", "2024-05-28T00:00:00", "2024-05-29T00:00:00", "2024-05-30T00:00:00", "2024-05-31T00:00:00", "2024-06-01T00:00:00", "2024-06-02T00:00:00", "2024-06-03T00:00:00", "2024-06-04T00:00:00", "2024-06-05T00:00:00", "2024-06-06T00:00:00", "2024-06-07T00:00:00", "2024-06-08T00:00:00", "2024-06-09T00:00:00", "2024-06-10T00:00:00", "2024-06-11T00:00:00", "2024-06-12T00:00:00", "2024-06-13T00:00:00", "2024-06-14T00:00:00", "2024-06-15T00:00:00", "2024-06-16T00:00:00", "2024-06-17T00:00:00", "2024-06-18T00:00:00", "2024-06-19T00:00:00", "2024-06-20T00:00:00", "2024-06-21T00:00:00", "2024-06-22T00:00:00", "2024-06-23T00:00:00", "2024-06-24T00:00:00", "2024-06-25T00:00:00", "2024-06-26T00:00:00", "2024-06-27T00:00:00", "2024-06-28T00:00:00", "2024-06-29T00:00:00", "2024-06-30T00:00:00", "2024-07-01T00:00:00", "2024-07-02T00:00:00", "2024-07-03T00:00:00", "2024-07-04T00:00:00", "2024-07-05T00:00:00", "2024-07-06T00:00:00", "2024-07-07T00:00:00", "2024-07-08T00:00:00", "2024-07-09T00:00:00", "2024-07-10T00:00:00", "2024-07-11T00:00:00", "2024-07-12T00:00:00", "2024-07-13T00:00:00", "2024-07-14T00:00:00", "2024-07-15T00:00:00", "2024-07-16T00:00:00", "2024-07-17T00:00:00", "2024-07-18T00:00:00", "2024-07-19T00:00:00", "2024-07-20T00:00:00", "2024-07-21T00:00:00", "2024-07-22T00:00:00", "2024-07-23T00:00:00", "2024-07-24T00:00:00", "2024-07-25T00:00:00", "2024-07-26T00:00:00", "2024-07-27T00:00:00", "2024-07-28T00:00:00", "2024-07-29T00:00:00", "2024-07-30T00:00:00", "2024-07-31T00:00:00", "2024-08-01T00:00:00", "2024-08-02T00:00:00", "2024-08-03T00:00:00", "2024-08-04T00:00:00", "2024-08-05T00:00:00", "2024-08-06T00:00:00", "2024-08-07T00:00:00", "2024-08-08T00:00:00", "2024-08-09T00:00:00", "2024-08-10T00:00:00", "2024-08-11T00:00:00", "2024-08-12T00:00:00", "2024-08-13T00:00:00", "2024-08-14T00:00:00", "2024-08-15T00:00:00", "2024-08-16T00:00:00", "2024-08-17T00:00:00", "2024-08-18T00:00:00", "2024-08-19T00:00:00", "2024-08-20T00:00:00", "2024-08-21T00:00:00", "2024-08-22T00:00:00", "2024-08-23T00:00:00", "2024-08-24T00:00:00", "2024-08-25T00:00:00", "2024-08-26T00:00:00", "2024-08-27T00:00:00", "2024-08-28T00:00:00", "2024-08-29T00:00:00", "2024-08-30T00:00:00", "2024-08-31T00:00:00", "2024-09-01T00:00:00", "2024-09-02T00:00:00", "2024-09-03T00:00:00", "2024-09-04T00:00:00", "2024-09-05T00:00:00", "2024-09-06T00:00:00", "2024-09-07T00:00:00", "2024-09-08T00:00:00", "2024-09-09T00:00:00", "2024-09-10T00:00:00", "2024-09-11T00:00:00", "2024-09-12T00:00:00", "2024-09-13T00:00:00", "2024-09-14T00:00:00", "2024-09-15T00:00:00", "2024-09-16T00:00:00", "2024-09-17T00:00:00", "2024-09-18T00:00:00", "2024-09-19T00:00:00", "2024-09-20T00:00:00", "2024-09-21T00:00:00", "2024-09-22T00:00:00", "2024-09-23T00:00:00", "2024-09-24T00:00:00", "2024-09-25T00:00:00", "2024-09-26T00:00:00", "2024-09-27T00:00:00", "2024-09-28T00:00:00", "2024-09-29T00:00:00", "2024-09-30T00:00:00", "2024-10-01T00:00:00", "2024-10-02T00:00:00", "2024-10-03T00:00:00", "2024-10-04T00:00:00", "2024-10-05T00:00:00", "2024-10-06T00:00:00", "2024-10-07T00:00:00", "2024-10-08T00:00:00", "2024-10-09T00:00:00", "2024-10-10T00:00:00", "2024-10-11T00:00:00", "2024-10-12T00:00:00", "2024-10-13T00:00:00", "2024-10-14T00:00:00", "2024-10-15T00:00:00", "2024-10-16T00:00:00", "2024-10-17T00:00:00", "2024-10-18T00:00:00", "2024-10-19T00:00:00", "2024-10-20T00:00:00", "2024-10-21T00:00:00", "2024-10-22T00:00:00", "2024-10-23T00:00:00", "2024-10-24T00:00:00", "2024-10-25T00:00:00", "2024-10-26T00:00:00", "2024-10-27T00:00:00", "2024-10-28T00:00:00", "2024-10-29T00:00:00", "2024-10-30T00:00:00", "2024-10-31T00:00:00", "2024-11-01T00:00:00", "2024-11-02T00:00:00", "2024-11-03T00:00:00", "2024-11-04T00:00:00", "2024-11-05T00:00:00", "2024-11-06T00:00:00", "2024-11-07T00:00:00", "2024-11-08T00:00:00", "2024-11-09T00:00:00", "2024-11-10T00:00:00", "2024-11-11T00:00:00", "2024-11-12T00:00:00", "2024-11-13T00:00:00", "2024-11-14T00:00:00", "2024-11-15T00:00:00", "2024-11-16T00:00:00", "2024-11-17T00:00:00", "2024-11-18T00:00:00", "2024-11-19T00:00:00", "2024-11-20T00:00:00", "2024-11-21T00:00:00", "2024-11-22T00:00:00", "2024-11-23T00:00:00", "2024-11-24T00:00:00", "2024-11-25T00:00:00", "2024-11-26T00:00:00", "2024-11-27T00:00:00", "2024-11-28T00:00:00", "2024-11-29T00:00:00", "2024-11-30T00:00:00", "2024-12-01T00:00:00", "2024-12-02T00:00:00", "2024-12-03T00:00:00", "2024-12-04T00:00:00", "2024-12-05T00:00:00", "2024-12-06T00:00:00", "2024-12-07T00:00:00", "2024-12-08T00:00:00", "2024-12-09T00:00:00", "2024-12-10T00:00:00", "2024-12-11T00:00:00", "2024-12-12T00:00:00", "2024-12-13T00:00:00", "2024-12-14T00:00:00", "2024-12-15T00:00:00", "2024-12-16T00:00:00", "2024-12-17T00:00:00", "2024-12-18T00:00:00", "2024-12-19T00:00:00", "2024-12-20T00:00:00"];
const gitCommitMessages = [
  "Update HTML structure for better semantics",
  "Refactor HTML layout for improved readability",
  "Fix HTML indentation and formatting",
  "Add new section to HTML page",
  "Remove unused HTML elements",
  "Improve HTML accessibility with ARIA attributes",
  "Update HTML headings hierarchy",
  "Fix broken links in HTML",
  "Optimize HTML for mobile responsiveness",
  "Add meta tags to HTML head",
  "Update HTML form design",
  "Fix HTML table layout",
  "Add new buttons to HTML page",
  "Update HTML footer design",
  "Improve HTML image loading with lazy loading",
  "Fix HTML validation errors",
  "Update HTML navigation menu",
  "Add new HTML template for blog posts",
  "Refactor HTML for better SEO",
  "Update HTML hero section design",
  "Fix HTML alignment issues",
  "Add new HTML cards for product listings",
  "Update HTML typography styles",
  "Fix HTML overflow issues",
  "Add new HTML modals for user interactions",
  "Update HTML grid layout",
  "Fix HTML z-index issues",
  "Add new HTML animations",
  "Update HTML color scheme",
  "Fix HTML spacing and padding",
  "Add new HTML icons",
  "Update HTML button styles",
  "Fix HTML form validation",
  "Add new HTML dropdown menus",
  "Update HTML header design",
  "Fix HTML scroll behavior",
  "Add new HTML tooltips",
  "Update HTML sidebar layout",
  "Fix HTML media queries",
  "Add new HTML accordions",
  "Update HTML carousel design",
  "Fix HTML flexbox issues",
  "Add new HTML tabs",
  "Update HTML call-to-action buttons",
  "Fix HTML print styles",
  "Add new HTML progress bars",
  "Update HTML error pages",
  "Fix HTML iframe sizing",
  "Add new HTML charts",
  "Update HTML testimonials section",
  "Fix HTML sticky header",
  "Add new HTML parallax effects",
  "Update HTML pricing tables",
  "Fix HTML video embedding",
  "Add new HTML maps",
  "Update HTML search bar design",
  "Fix HTML checkbox and radio buttons",
  "Add new HTML sliders",
  "Update HTML newsletter form",
  "Fix HTML transitions and animations",
  "Add new HTML breadcrumbs",
  "Update HTML login page design",
  "Fix HTML dropdown alignment",
  "Add new HTML filters",
  "Update HTML contact form",
  "Fix HTML hover effects",
  "Add new HTML counters",
  "Update HTML gallery layout",
  "Fix HTML background images",
  "Add new HTML timelines",
  "Update HTML dashboard design",
  "Fix HTML input fields",
  "Add new HTML notifications",
  "Update HTML profile page",
  "Fix HTML list styles",
  "Add new HTML badges",
  "Update HTML blog layout",
  "Fix HTML modal positioning",
  "Add new HTML toggles",
  "Update HTML landing page",
  "Fix HTML font loading",
  "Add new HTML dividers",
  "Update HTML error messages",
  "Fix HTML button alignment",
  "Add new HTML popups",
  "Update HTML dashboard widgets",
  "Fix HTML image sizing",
  "Add new HTML progress indicators",
  "Update HTML signup form",
  "Fix HTML table responsiveness",
  "Add new HTML tags for SEO",
  "Update HTML page transitions",
  "Fix HTML form spacing",
  "Add new HTML loading spinners",
  "Update HTML footer links",
  "Fix HTML video autoplay",
  "Add new HTML social media icons",
];
const HTML5_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!-- bootstrap for shopify -->
</body>
</html>`;

/**
 * Random HTML tags to append to the body.
 */
const RANDOM_HTML_TAGS = [
  '<p class="">{{paragraph_template}}</p>',
  '<div class="holiday-special" style="color: grey;">Checkout these holiday special</div>',
  '<h2>{{page_heading}}</h2>',
  '<a href="#">Click here to go home</a>',
  '<span class="">{{paragraph_template}}</span>',
  '<div class="holiday-special" style="color: grey;">Bid deals for her</div>',
  '<h2>{{page_heading}}</h2>',
  '<a href="#">Click here to go home</a>',
  '<button class="cancel-button">Cancel</button>',
];

/**
 * Recursively scans a directory for files with the .html extension.
 * @param dirPath The directory path to scan.
 * @returns An array of file paths with the .html extension.
 */
function scanForHtmlFiles(dirPath: string): string[] {
  let htmlFiles: string[] = [];

  // Read the contents of the directory
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // If the item is a directory, recursively scan it
      htmlFiles = htmlFiles.concat(scanForHtmlFiles(fullPath));
    } else if (stat.isFile() && path.extname(item).toLowerCase() === '.html') {
      // If the item is a file and has a .html extension, add it to the list
      htmlFiles.push(fullPath);
    }
  }

  return htmlFiles;
}

/**
 * Modifies the content of an HTML file.
 * @param filePath The path to the HTML file.
 */
function modifyHtmlFile(filePath: string, date:string, callback:Function) {
  let content = fs.readFileSync(filePath, 'utf-8').trim();

  if (content === '') {
    // If the file is empty, fill it with the HTML5 template
    content = HTML5_TEMPLATE;
  } else {
    // If the file is not empty, append a random HTML tag to the body
    const randomTag = RANDOM_HTML_TAGS[Math.floor(Math.random() * RANDOM_HTML_TAGS.length)];
    const bodyCloseTag = '</body>';
    const bodyCloseIndex = content.lastIndexOf(bodyCloseTag);

    if (bodyCloseIndex !== -1) {
      // Insert the random tag before the closing body tag
      content = content.slice(0, bodyCloseIndex) + randomTag + content.slice(bodyCloseIndex);
    } else {
      // If no body tag is found, append the random tag at the end
      content += randomTag;
    }
  }

  // Write the modified content back to the file
  fs.writeFileSync(filePath, content, 'utf-8');

  // Run the shell command after saving the file
  const fileName = path.basename(filePath);
  // GIT_COMMITTER_DATE="${date}" GIT_AUTHOR_DATE="2024-10-09T00:00:00" git commit -m 'update page template'
  const pos = Math.floor(Math.random() * gitCommitMessages.length - 1);
  const commitMessage = gitCommitMessages[pos];
  exec(`GIT_COMMITTER_DATE="${date}" GIT_AUTHOR_DATE="${date}" git add . && git commit -m '${commitMessage} for [${fileName}]'`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running shell command for ${fileName}:`, error);
      return;
    }
    callback();
    console.log(stdout.trim());
  });
}

/**
 * Main function to execute the script.
 */
function main() {
  const directoryPath = process.argv[2]; // Get the directory path from command line arguments

  if (!directoryPath) {
    console.error('Please provide a directory path as an argument.');
    process.exit(1);
  }

  if (!fs.existsSync(directoryPath)) {
    console.error(`The directory "${directoryPath}" does not exist.`);
    process.exit(1);
  }

  const htmlFiles = scanForHtmlFiles(directoryPath);
  let totalOperation = 0;
  let i = 0, j = 0;

  while (i < commitDates.length) {

    const commitDate = commitDates[i];
    const commitCount = dailyCommitsRand[i];
    let fileIndex = 0;

    while (j < commitCount) {
      console.log('modifying file', htmlFiles[fileIndex]);
      modifyHtmlFile(htmlFiles[fileIndex], commitDate, () => {
        fileIndex++;
        if (!htmlFiles[fileIndex]) {
          fileIndex = 0;
        }
        totalOperation++;
        j++;
      });
    }
    i++;
  }

  // for (let j = 0; j < commitCount; j++) {
  // }
  // for (let i = 0; i < commitDates.length; i++) {

  // }

  console.log('totalOperation', totalOperation);


  // if (htmlFiles.length === 0) {
  //   console.log('No .html files found.');
  // } else {
  //   console.log('Found .html files:');
  //   htmlFiles.forEach(file => {
  //     console.log('found file ->', file);
  //     //modifyHtmlFile(file);
  //   });
  // }
}

// Run the script
main();