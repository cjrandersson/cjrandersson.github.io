// Public project selection, in display and navigation order.
// Cover controls the Work preview; media and storySections belong to the project page.
window.PROJECTS = [
  {
    "slug": "flode",
    "title": "flöde~",
    "category": "uxui",
    "year": "2026",
    "meta": "(Max/Msp, m4l, VST, Standalone)",
    "thumbnail": "media/flode/flode-six-channel-logo-large.png",
    "media": [
      "media/flode/flode-six-channel-logo-large.png",
      "media/flode/flode-pod-design.png",
      "media/flode/flode-orange-interface.png",
      "media/flode/flode-hardware-render.png"
    ],
    "alt": "Flöde six-channel sampler and generative sequencer interface",
    "aspectRatio": "3 / 2",
    "size": "wide",
    "intro": {
      "name": "flöde~",
      "lead": "a living modular instrument for sound manipulation built in Max/MSP and m4l (Ableton) but also a standalone version for both Windows and Mac OS systems.",
      "question": "In short, what is it and what does it do?",
      "between": [
        "a 6-channel sampler",
        "a generative sequencer",
        "a sound mangler",
        "a loop machine",
        "... and an improvisational electronic instrument"
      ],
      "body": "Each pod loads, plays and changes sound through speed, panning, volume, slicing, probability and controlled randomness, among other things. The pods can work independently – almost like small organisms – but are held together by a common tempo and synchronization."
    },
    "definitions": [
      "Modular generation — six autonomous pods reshape and interweave samples in real time.",
      "6-channel sampling — load, loop and transform six sound sources in parallel.",
      "Generative sequencing — evolve patterns through probability and controlled randomness.",
      "Real-time audio mangling — reshape speed, pitch, slicing, panning and volume.",
      "Loop-machine performance — capture and repeat material without breaking flow.",
      "Rhythmic precision — lock every pod to a shared master clock and BPM.",
      "Evolving soundscapes — create unpredictable textures that remain musically connected.",
      "Open-ended instrument — use it however your creative practice demands."
    ],
    "definitionClosing": "... or what you as a creative want it to be",
    "description": "Interface, interaction and hardware concept for a six-channel sampler workstation.",
    "details": {
      "what": "A six-channel sampler, generative sequencer, sound mangler and looper.",
      "why": "To make controlled randomness playable as one synchronized instrument.",
      "thoughts": "Six autonomous pods behave independently while sharing one clock.",
      "software": [
        "Max/MSP",
        "Max for Live",
        "Ableton Live"
      ]
    },
    "cover": {
      "src": "media/flode/flode-hardware-render.png",
      "alt": "flöde~ hardware concept with six coloured waveform channels and tactile controls",
      "label": "Sound / Instrument design",
      "summary": "Six channels. One shared clock. Room for the unexpected."
    }
  },
  {
    "slug": "tunnelbanekollen",
    "title": "Tunnelbanekollen",
    "category": "uxui",
    "year": "2026",
    "meta": "(React, TypeScript, realtime systems)",
    "thumbnail": "media/tunnelbanekollen/tunnelbanekollen-ui.svg",
    "titleIcon": "media/tunnelbanekollen/tunnelbanekollen-eye.svg",
    "media": [
      "media/tunnelbanekollen/tunnelbanekollen-ui.svg",
      "media/tunnelbanekollen/tunnelbanekollen-report-view.svg",
      "media/tunnelbanekollen/tunnelbanekollen-map.svg"
    ],
    "alt": "Tunnelbanekollen metro map and anonymous station reporting interface",
    "aspectRatio": "16 / 9",
    "size": "wide",
    "featured": true,
    "intro": {
      "name": "Tunnelbanekollen",
      "lead": "A community-built layer for the gap between the timetable and the lived journey.",
      "question": "What does the map know?",
      "between": [
        "anonymous station reports",
        "public transit movement",
        "confidence over certainty"
      ],
      "body": "Short, time-sensitive reports become a shared picture of conditions across the network — without tracking individuals."
    },
    "definitions": [
      "Signal, not surveillance — activity is aggregated at station and line level.",
      "Map as interface — the network itself becomes the navigation and reporting surface.",
      "Clarity under pressure — colour, symbols and hierarchy make each update readable at a glance."
    ],
    "definitionClosing": "A static map, made responsive to the city moving through it.",
    "description": "A live civic signal layer for Stockholm’s metro — turning a static transit map into a shared picture of what is happening now.",
    "details": {
      "what": "Concept, product framing, UX/UI, visual identity and a working React/TypeScript frontend prototype.",
      "why": "Timetables show when the train moves. Tunnelbanekollen reveals what is happening around it.",
      "thoughts": "Anonymous station-level signals become a graphic language of lines, alerts and probability — information without surveillance.",
      "software": [
        "React",
        "TypeScript",
        "Vite",
        "Tailwind CSS",
        "SVG",
        "GTFS"
      ]
    },
    "cover": {
      "src": "media/tunnelbanekollen/tunnelbanekollen-ui.svg",
      "alt": "Tunnelbanekollen interface with a colourful Stockholm metro map and station reports",
      "label": "Civic tech / Interface design",
      "summary": "A shared picture of the city moving underground."
    }
  },
  {
    "slug": "reko-nord",
    "title": "REKO Nord",
    "category": "uxui",
    "year": "2026",
    "meta": "(React, TypeScript, responsive product systems)",
    "thumbnail": "media/reko-nord/v1-marketplace.jpg",
    "media": [
      "media/reko-nord/v1-marketplace.jpg",
      "media/reko-nord/v1-farm-profile.jpg",
      "media/reko-nord/v1-cart.jpg",
      "media/reko-nord/v1-producer-dashboard.jpg",
      "media/reko-nord/v1-product-management.jpg",
      "media/reko-nord/v1-orders.jpg"
    ],
    "alt": "REKO Nord responsive marketplace and producer portal for local direct food trade",
    "aspectRatio": "16 / 10",
    "size": "wide",
    "featured": true,
    "description": "A direct-to-consumer operating system for local food — shortening the distance between who grows it, who buys it and what ends up on the table.",
    "details": {
      "what": "Product strategy, UX/UI and a responsive consumer marketplace and producer portal built as one React and TypeScript MVP.",
      "why": "Good food should not need a bad interface. REKO Nord removes the administrative friction around local trade while keeping the direct relationship intact.",
      "thoughts": "Not another delivery app — shared infrastructure for weekly trade, where origin stays visible and producers stay in control.",
      "software": [
        "React 19",
        "TypeScript",
        "Tailwind CSS 4",
        "Vite",
        "Node.js",
        "Shadcn",
        "Lucide"
      ]
    },
    "storySections": [
      {
        "eyebrow": "Origin before algorithm",
        "title": "The farm is not a seller ID.",
        "body": "Every producer gets a real front door: place, people, methods, values and weekly assortment. The interface keeps origin visible before price turns food into another anonymous product.",
        "bullets": [
          "Farm story and location",
          "Production methods and principles",
          "Pickup details and direct contact",
          "A reusable, shoppable assortment"
        ],
        "media": "media/reko-nord/v1-farm-profile.jpg"
      },
      {
        "eyebrow": "Consumer flow",
        "title": "Less checkout. More certainty.",
        "body": "Products from nearby farms move into one calm overview with quantities, pickup time, producer and total always visible. Convenience without hiding where the food came from.",
        "bullets": [
          "Search, filters and quick add",
          "One readable basket",
          "Clear pickup context",
          "Simple Swish-ready order flow"
        ],
        "media": "media/reko-nord/v1-cart.jpg"
      },
      {
        "eyebrow": "Producer flow",
        "title": "The week, reduced to what matters.",
        "body": "The producer portal opens on the next real task — not a dashboard full of software. Orders, value, payment exceptions and pickup preparation are readable in seconds.",
        "bullets": [
          "Next pickup first",
          "Sales and order status",
          "Only actionable alerts",
          "Responsive in the barn, kitchen or office"
        ],
        "media": "media/reko-nord/v1-producer-dashboard.jpg"
      },
      {
        "eyebrow": "Reusable supply",
        "title": "Create once. Sell with the season.",
        "body": "A product should not be rebuilt every Thursday. Producers reuse their catalogue, adjust stock for the current harvest and publish the week in one deliberate action.",
        "bullets": [
          "Reusable product catalogue",
          "Inventory per pickup",
          "Fast price and quantity edits",
          "One-click weekly publishing"
        ],
        "media": "media/reko-nord/v1-product-management.jpg"
      },
      {
        "eyebrow": "Paid to picked up",
        "title": "Every order knows its next step.",
        "body": "Payment, customer, order value, products and handover status live in the same view. The system turns scattered messages and handwritten lists into a practical pickup flow.",
        "bullets": [
          "Betald, Väntar betalning, Åtgärd krävs",
          "Order number and value together",
          "Customer contact and pick list",
          "Pickup handling and history"
        ],
        "media": "media/reko-nord/v1-orders.jpg"
      }
    ],
    "cover": {
      "src": "media/reko-nord/v1-marketplace.jpg",
      "alt": "REKO Nord MVP V1 marketplace with a local producer map and farm search",
      "label": "Local food / Product design",
      "summary": "A shorter path from the farm to the table."
    }
  }
];
