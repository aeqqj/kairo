# Kairo CPU Scheduling Simulator

Kairo is a browser-based simulator for comparing how CPU scheduling algorithms run a workload and affect process turnaround and waiting times. The project uses Vite, React, TypeScript, Tailwind CSS, Lucide icons, and React Spring.

## 4. Implemented Features & Requirements Checklist

Check an item after verifying it in the simulator.

### Required core algorithms

- [ ] **First-Come, First-Served (FCFS)** runs processes to completion in arrival order. Lower process number breaks arrival ties.
- [ ] **Shortest Job First (SJF)** runs the arrived process with the shortest burst time to completion.
- [ ] **Shortest Remaining Time First (SRTF)** preempts a running process when a new arrival has a strictly shorter remaining time. The running process continues on ties.
- [ ] **Non-preemptive Priority Scheduling** runs the arrived process with the highest priority to completion. Lower numbers indicate higher priority.

### Core input, output, and validation

- [ ] Support 1–10 processes. Accept only whole numbers for Arrival Time (≥ 0), Burst Time (≥ 1), and Priority (≥ 1).
- [ ] Reject empty, negative, non-numeric, and fractional values, as well as zero for Burst Time and Priority. Show a clear error identifying the affected process and field. Keep the entered values available for correction and prevent the invalid run.
- [ ] Show an **Idle** block in the Gantt chart for every interval when no process is ready, including before the first arrival if it occurs after time zero.
- [ ] Show Arrival Time, Burst Time, Completion Time, Turnaround Time, Waiting Time, and Response Time for each process in the results table. Display average turnaround and waiting times to exactly two decimal places.

### Backend

Use **Node.js, TypeScript, and Fastify** for a JSON API. Fastify can validate requests and define response shapes with JSON Schema. Keep the scheduling functions independent of Fastify so they can be tested directly. Use PostgreSQL for saved runs. The group will choose how to handle sign-in and where to host the database. [Fastify validation](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/)

- [ ] Implement `POST /api/simulations`. The request contains an `algorithm` (`fcfs`, `sjf`, `srtf`, `priority`, `rr`, or `preemptive-priority`) and a `processes` array of 1–10 entries with numeric `arrivalTime`, `burstTime`, and `priority` fields. Assign P1 through P10 in input order. Require a positive whole-number `timeQuantum` for Round Robin.
- [ ] Validate on the server before scheduling. Reject numeric strings, unsupported algorithms, and values outside the input requirements. Return HTTP `400` with an `errors` array containing a field `path` and a readable `message` for each reported error, for example `processes[1].burstTime`. Preserve form values in React so the user can correct the field and retry.
- [ ] Return HTTP `200` with `timeline`, `results`, and `averages`. Each timeline block has `processId` (`null` for Idle), `start`, and `end` in simulation units. Each result row has `processId`, `arrivalTime`, `burstTime`, `completionTime`, `turnaroundTime`, `waitingTime`, and `responseTime` in input order. Return numeric `turnaroundTime` and `waitingTime` averages and format them to two decimal places in React.
- [ ] Use Vite's development proxy for `/api` locally. For deployment, serve the frontend and API under the same origin. Show a retryable error if the request fails and keep the current workload available.
- [ ] Verify the endpoint with a valid workload for each required algorithm and with invalid input. Check that a run with Idle time returns the expected timeline, metrics, and averages.

### Accounts and run history

- [ ] Let guests run simulations. Signed-in users can choose **Save run** after a successful simulation. A save failure leaves the chart and workload available so the user can retry.
- [ ] Save the run ID, owner ID, creation time, algorithm, original inputs, timeline, results, averages, and snapshot format version. Generate saved results on the server. Reopen the stored snapshot so later scheduler changes preserve the original chart. Store the inputs and results as PostgreSQL `jsonb` and index history by owner and creation time. [PostgreSQL JSON types](https://www.postgresql.org/docs/current/datatype-json.html)
- [ ] Make history private. Fastify derives the owner from the verified session and checks ownership on read and delete. Verify that one account cannot open or delete another account's run.
- [ ] Show history newest first with the algorithm, process count, and save date. Users can reopen or delete a run. Reopening restores the saved chart, and rerunning with edited inputs creates a separate run if saved. Confirm deletion and prevent duplicate entries when the same save is retried.

### Additional algorithms and features

The combined bonus is capped at +15 points.

| Status | Algorithm or feature | Max points | Implementation notes to complete |
| --- | --- | --- | --- |
| ☐ | Round Robin with user-set time quantum | +4 | Record queue ordering on quantum expiration, including how arrivals at the same time are handled. |
| ☐ | Preemptive Priority | +2 to +5 | Verify preemption and equal-priority ties using the rules below. |
| ☐ | Side-by-side comparison and step-by-step Gantt animation | +3 each | Describe the controls and what the user can compare or step through. |
| ☐ | PDF, CSV, and image export, online deployment, and response time | +1 to +2 | Describe how to export results, access the deployed simulator, and read response time. |

## 5. Algorithm Explanations

These rules specify the intended implementation. Where the requirements leave a tie unspecified, prefer earlier arrival and then lower process number. Label processes in input order from P1 through P10 and compare their numbers numerically.

- **FCFS.** Sort by arrival time, then by process number. Take processes in that order and run each to completion, moving the clock to the next arrival and recording an Idle block whenever the ready queue is empty.
- **SJF.** At each dispatch, consider only unfinished processes whose arrival time is at or before the current clock. Select the smallest burst time and run the process to completion. Resolve equal burst times by earlier arrival, then lower process number.
- **SRTF.** Initialize each process's remaining time to its burst time. At each whole-number time boundary, add new arrivals before choosing the process for the next time unit. Decrease the running process's remaining time by one per unit. Keep it running unless an arrival has strictly less remaining time. When selecting a process without a current runner, or choosing among equally short processes eligible to preempt, use earlier arrival and then lower process number. Mark a process complete when its remaining time reaches zero.
- **Non-preemptive Priority Scheduling.** At each dispatch, consider only unfinished processes that have arrived. Select the lowest numeric priority and run that process to completion. Resolve equal priorities by earlier arrival, then lower process number.
- **Round Robin (RR).** Give the process at the front of the ready queue up to the chosen time quantum. If it is unfinished when the quantum expires, append it to the back of the queue. At the same time boundary, enqueue new arrivals in process-number order before requeueing the expired process.
- **Preemptive Priority.** Run the ready process with the lowest priority number. A ready process with a strictly lower priority number preempts the current process. On equal priorities, keep the current process running. At dispatch, resolve equal priorities by arrival time, then process number.

Completion time is the clock time at which a process finishes its last CPU interval. Turnaround time is completion time minus arrival time. Waiting time is turnaround time minus burst time. Response time is the time the process first runs minus its arrival time. Calculate averages from the per-process values before rounding for display.

## 6. User Guide & Application Screenshots

### Step-by-step user guide

The following steps describe the intended simulator workflow.

1. **Launch the simulator.** Open the submitted website URL. To run the project locally, execute `npm ci` and `npm run dev` in the repository root, then open the URL printed by Vite.
2. **Configure processes.** Set the process count from 1 to 10. Enter Arrival Time, Burst Time, and Priority for each process. Correct any errors shown next to the inputs.
3. **Select an algorithm and run.** Choose an algorithm from the menu. If you select Round Robin, enter a positive whole-number time quantum. Click **Run**.
4. **Interpret results and reset.** Read the Gantt chart from left to right to see when each process runs and when the CPU is idle. Review the results table and the two-decimal averages. Click **Reset** to clear the previous run and restore the default inputs.

### Application screenshots

1. **Input screen and validation error handling.** Pending. Capture the process input fields with a visible validation error, such as the message shown for a burst time of zero.
2. **Simulation output.** Pending. Capture a completed run with the Gantt chart, at least one Idle block, the complete results table, and averages displayed to two decimal places.

## 7. Project Milestone & Verification Tracker

| Status | Date | Milestone | Verification checklist |
| --- | --- | --- | --- |
| ☐ | Nov 26, 2026 | Progress Check 1 | Confirm group registration, a UI that supports 1–10 processes, working FCFS, and a basic Gantt chart. |
| ☐ | Dec 1, 2026 | Progress Check 2 | Verify SJF, non-preemptive Priority Scheduling, the full results table, two-decimal averages, and Idle blocks. |
| ☐ | Dec 3, 2026 | Progress Check 3 | Verify SRTF and full input validation. Review progress on the additional algorithms and features. |
| ☐ | Dec 11, 2026 | Online Submission & Code Freeze | Submit the executable or website link, GitHub repository with `README.md`, and PDF by 11:59 PM. Freeze the submitted code. |
| ☐ | Dec 15, 2026 | Final Exam & Oral Defense | Run the official test cases live and deliver a 10-minute group oral defense. |
