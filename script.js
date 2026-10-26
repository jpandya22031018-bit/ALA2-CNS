
// Safe educational simulation only.
// No files or real networks are accessed.

(() => {
  "use strict";

  const simulations = {
    virus: {
      title: "Computer Virus",
      description: "Illustrates a host-bound threat using fictional sample filenames only.",
      nodes: ["gateway", "finance", "dev"],
      steps: [
        ["INFO", "Starting virus concept simulation..."],
        ["INFO", "Loading fictional sample: document.txt"],
        ["WARN", "Sample file marked as SIMULATED ONLY."],
        ["INFO", "Loading fictional sample: photo.jpg"],
        ["WARN", "No file was opened or modified."],
        ["OK", "Virus concept demonstration complete."]
      ]
    },

    worm: {
      title: "Network Worm",
      description: "Illustrates movement between fictional network nodes only.",
      nodes: ["gateway", "finance", "sql", "hr"],
      steps: [
        ["INFO", "Starting worm concept simulation..."],
        ["INFO", "Fictional node selected: Node-Gateway"],
        ["WARN", "Drawing simulated path to Finance-PC1."],
        ["INFO", "Drawing simulated path to SQL-Database."],
        ["WARN", "No ports were scanned and no packets were sent."],
        ["OK", "Worm concept demonstration complete."]
      ]
    },

    trojan: {
      title: "Trojan Horse",
      description: "Flags a sample application name as suspicious without launching it.",
      nodes: ["gateway", "dev"],
      steps: [
        ["INFO", "Starting Trojan concept simulation..."],
        ["INFO", "Reviewing sample label: Free_Game.exe"],
        ["WARN", "Sample app flagged as suspicious for demonstration."],
        ["INFO", "No application was launched or installed."],
        ["OK", "Trojan concept demonstration complete."]
      ]
    }
  };

  const cards = [...document.querySelectorAll(".class-card")];
  const title = document.getElementById("selectedTitle");
  const description = document.getElementById("selectedDescription");
  const runButton = document.getElementById("runButton");
  const resetButton = document.getElementById("resetButton");
  const cycleValue = document.getElementById("cycleValue");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const logOutput = document.getElementById("logOutput");
  const nodes = [...document.querySelectorAll(".network-node")];

  let selectedType = "virus";
  let timers = [];
  let running = false;

  function clearTimers() {
    timers.forEach(timer => clearTimeout(timer));
    timers = [];
    running = false;
    runButton.disabled = false;
  }

  function timestamp() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
  }

  function addLog(level, message) {
    const row = document.createElement("p");

    const time = document.createElement("span");
    time.className = "log-time";
    time.textContent = `[${timestamp()}] `;

    const text = document.createElement("span");
    text.className =
      level === "OK" ? "log-ok" :
      level === "WARN" ? "log-warn" : "log-info";
    text.textContent = `${level}: ${message}`;

    row.append(time, text);
    logOutput.appendChild(row);
    logOutput.scrollTop = logOutput.scrollHeight;
  }

  function selectClass(type) {
    if (running || !simulations[type]) return;

    selectedType = type;

    cards.forEach(card => {
      const active = card.dataset.type === type;
      card.classList.toggle("selected", active);
      card.setAttribute("aria-pressed", String(active));

      card.querySelector(".card-action").textContent =
        active ? "SELECTED ✓" : "SELECT CLASS →";
    });

    title.textContent = simulations[type].title;
    description.textContent = simulations[type].description;

    addLog("INFO", `${simulations[type].title} selected.`);
  }

  function resetSimulation(showMessage = true) {
    clearTimers();

    nodes.forEach(node => {
      node.classList.remove("active-node", "alert-node");
    });

    progressBar.style.width = "0%";
    progressText.textContent = "0%";
    cycleValue.textContent = "IDLE";

    logOutput.replaceChildren();

    const message = document.createElement("p");
    message.className = "log-muted";
    message.textContent = "Awaiting simulation command...";
    logOutput.appendChild(message);

    if (showMessage) {
      addLog("INFO", "Simulation reset. No real activity occurred.");
    }
  }

  function runSimulation() {
    if (running) return;

    resetSimulation(false);

    running = true;
    runButton.disabled = true;
    cycleValue.textContent = "RUNNING";

    const simulation = simulations[selectedType];
    addLog("INFO", "Visual-only simulation started.");

    const stepDelay = 800;

    simulation.steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        addLog(step[0], step[1]);

        const progress = Math.round(
          ((index + 1) / simulation.steps.length) * 100
        );

        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;

        nodes.forEach(node => {
          node.classList.remove("active-node", "alert-node");
        });

        const nodeName =
          simulation.nodes[index % simulation.nodes.length];

        const node = document.querySelector(
          `[data-node="${nodeName}"]`
        );

        if (node) {
          node.classList.add(
            step[0] === "WARN" ? "alert-node" : "active-node"
          );
        }

        if (index === simulation.steps.length - 1) {
          cycleValue.textContent = "COMPLETE";
          running = false;
          runButton.disabled = false;

          addLog("OK", "Simulation complete. All nodes are fictional.");
        }
      }, stepDelay * (index + 1));

      timers.push(timer);
    });
  }

  cards.forEach(card => {
    card.addEventListener("click", () => {
      selectClass(card.dataset.type);
    });
  });

  runButton.addEventListener("click", runSimulation);
  resetButton.addEventListener("click", () => resetSimulation(true));

  resetSimulation(false);
  addLog("INFO", "Ready. Select a class and run the simulation.");
})();
