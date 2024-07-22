# Care flow timeline

Learn how to render a timeline for a care flow and interact with different types of activities.

Built with [NextJS](https://nextjs.org/), [Tailwind](https://tailwindcss.com/), and [RadixUI](radix-ui.com). While this example uses NextJS, Tailwind, and RadixUI, these can be easily replaced with other JavaScript/React stacks if preferred.

**Features**:

- Display patient information on top of the page
- Chronologically display activities of a single care flow
- Complete activities with Hosted Pages
- Filter activities by stakeholders

## Demo

[Click here](https://care-flow-timeline.vercel.app/care-flow/INSERT_CARE_FLOW_ID) and replace "INSERT_CARE_FLOW_ID" at the end of the URL with an example care flow instance ID. See section "Run the sample" for more information.

## Installation

First, install all dependencies:

```bash
npm run install
```

To run locally, create a `.env.local` file that has the same keys as `.env.example` and specify the values.

Then run the development server:

```bash
npm run dev
```

## Run the sample

You will need a care flow instance ID to run the sample. This can be obtained via [our API](https://developers.awellhealth.com/awell-orchestration/api-reference/mutations/start-pathway) or simply start a care flow for a patient using [Awell Care](https://care.sandbox.awellhealth.com/).

Once you have the care flow instance ID, go to [http://localhost:3000/care-flow/INSERT_CAREFLOW_ID>](http://localhost:3000/care-flow/INSERT_CAREFLOW_ID) with your browser to see the result.
