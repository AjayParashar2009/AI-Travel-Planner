import React, { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export default function ExportPDFButton({ tripData }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (!tripData) {
      toast.error("Manifest data missing.");
      return;
    }

    setIsExporting(true);

    try {
      // 1. Create the document instance
      const doc = new jsPDF();

      // 2. 🛑 CRITICAL FIX: Attach autoTable to this specific doc instance
      autoTable(doc);

      const cityName =
        tripData.destination?.split(",")[0]?.trim() || "Destination";

      const destination = tripData.destination || cityName;

      const days = tripData.itinerary?.days || [];

      const travelers = tripData.input?.numTravelers || 1;

      const travelStyle = tripData.input?.travelStyle || "Standard";

      const budget = tripData.input?.budget || "N/A";

      // Calculate total cost
      const total = days.reduce((acc, day) => {
        return (
          acc +
          (parseFloat(day.morning?.estimatedCost) || 0) +
          (parseFloat(day.afternoon?.estimatedCost) || 0) +
          (parseFloat(day.evening?.estimatedCost) || 0)
        );
      }, 0);

      // --------------------------------------------------
      // Helper Functions
      // --------------------------------------------------

      const addPageNumber = () => {
        const pageCount = doc.internal.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);

          doc.text(
            `WanderAI • ${cityName}`,
            15,
            doc.internal.pageSize.height - 10,
          );

          doc.text(
            `Page ${i} of ${pageCount}`,
            195,
            doc.internal.pageSize.height - 10,
            {
              align: "right",
            },
          );
        }
      };

      const addSectionTitle = (title, y) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(20, 20, 25);
        doc.text(title, 15, y);

        doc.setDrawColor(220, 220, 220);
        doc.line(15, y + 3, 195, y + 3);

        return y + 12;
      };

      // --------------------------------------------------
      // 1. BRAND HEADER
      // --------------------------------------------------

      doc.setFillColor(39, 99, 235);
      doc.rect(0, 0, 210, 18, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("WANDER AI", 15, 12);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("AI TRAVEL MANIFEST", 195, 12, {
        align: "right",
      });

      // --------------------------------------------------
      // 2. DESTINATION HERO
      // --------------------------------------------------

      let y = 35;

      doc.setTextColor(20, 20, 25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);

      doc.text(cityName.toUpperCase(), 15, y);

      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);

      doc.text(destination, 15, y);

      // Status Badge
      doc.setFillColor(220, 252, 231);
      doc.roundedRect(155, 27, 40, 10, 3, 3, "F");

      doc.setTextColor(22, 101, 52);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");

      doc.text("CONFIRMED", 175, 33.5, {
        align: "center",
      });

      // --------------------------------------------------
      // 3. TRIP SUMMARY
      // --------------------------------------------------

      y = 60;

      doc.autoTable({
        startY: y,
        theme: "plain",

        head: [["DURATION", "TRAVELERS", "STYLE", "BUDGET", "EST. COST"]],

        body: [
          [
            `${days.length} Days`,
            `${travelers}`,
            travelStyle,
            `${budget}`,
            `₹${total.toLocaleString("en-IN")}`,
          ],
        ],

        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 6,
          textColor: [30, 30, 35],
        },

        headStyles: {
          fillColor: [245, 247, 250],
          textColor: [80, 80, 90],
          fontStyle: "bold",
          fontSize: 8,
        },

        bodyStyles: {
          fontStyle: "bold",
        },

        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 35 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
          4: { cellWidth: 40 },
        },

        margin: {
          left: 15,
          right: 15,
        },
      });

      y = doc.lastAutoTable.finalY + 15;

      // --------------------------------------------------
      // 4. INTERESTS
      // --------------------------------------------------

      const interests = tripData.input?.interest || [];

      if (interests.length > 0) {
        y = addSectionTitle("TRAVEL INTERESTS", y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 90);

        doc.text(interests.join(" • "), 15, y);

        y += 15;
      }

      // --------------------------------------------------
      // 5. ITINERARY
      // --------------------------------------------------

      y = addSectionTitle("ITINERARY", y);

      days.forEach((day, index) => {
        const activities = [
          {
            period: "Morning",
            data: day.morning,
          },
          {
            period: "Afternoon",
            data: day.afternoon,
          },
          {
            period: "Evening",
            data: day.evening,
          },
        ].filter((item) => item.data?.activity);

        if (activities.length === 0) return;

        // Keep each day together where possible
        if (y > 240) {
          doc.addPage();
          y = 25;
        }

        doc.setFillColor(39, 99, 235);
        doc.roundedRect(15, y - 6, 30, 9, 2, 2, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);

        doc.text(`DAY ${index + 1}`, 30, y, {
          align: "center",
        });

        y += 12;

        const tableRows = activities.map(({ period, data }) => [
          period,
          data.activity || "N/A",
          data.location || "N/A",
          data.description || "N/A",
          `₹${Number(data.estimatedCost || 0).toLocaleString("en-IN")}`,
        ]);

        doc.autoTable({
          startY: y,

          head: [["PERIOD", "ACTIVITY", "LOCATION", "DESCRIPTION", "COST"]],

          body: tableRows,

          theme: "grid",

          styles: {
            font: "helvetica",
            fontSize: 8,
            cellPadding: 4,
            valign: "top",
            textColor: [50, 50, 55],
          },

          headStyles: {
            fillColor: [17, 17, 19],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 7,
          },

          columnStyles: {
            0: {
              cellWidth: 22,
            },
            1: {
              cellWidth: 35,
            },
            2: {
              cellWidth: 30,
            },
            3: {
              cellWidth: 75,
            },
            4: {
              cellWidth: 20,
              halign: "right",
            },
          },

          margin: {
            left: 15,
            right: 15,
          },
        });

        y = doc.lastAutoTable.finalY + 12;
      });

      // --------------------------------------------------
      // 6. LOGISTICS
      // --------------------------------------------------

      if (tripData.logistics) {
        if (y > 230) {
          doc.addPage();
          y = 25;
        }

        y = addSectionTitle("LOGISTICS", y);

        const logistics = tripData.logistics;

        const logisticsRows = [];

        if (logistics.accommodation) {
          logisticsRows.push(["Accommodation", logistics.accommodation]);
        }

        if (logistics.transport || logistics.transportation) {
          logisticsRows.push([
            "Transportation",
            logistics.transport || logistics.transportation,
          ]);
        }

        if (logistics.travelers) {
          logisticsRows.push(["Travelers", logistics.travelers]);
        }

        if (logisticsRows.length > 0) {
          doc.autoTable({
            startY: y,
            theme: "striped",

            head: [["CATEGORY", "DETAILS"]],

            body: logisticsRows,

            styles: {
              font: "helvetica",
              fontSize: 9,
              cellPadding: 5,
            },

            headStyles: {
              fillColor: [39, 99, 235],
              textColor: [255, 255, 255],
              fontStyle: "bold",
            },

            margin: {
              left: 15,
              right: 15,
            },
          });

          y = doc.lastAutoTable.finalY + 15;
        }
      }

      // --------------------------------------------------
      // 7. AI INSIGHTS
      // --------------------------------------------------

      if (tripData.insights) {
        if (y > 220) {
          doc.addPage();
          y = 25;
        }

        y = addSectionTitle("AI TRAVEL INSIGHTS", y);

        const insights = tripData.insights;
        let insightRows = [];

        if (typeof insights === "string") {
          insightRows.push(["Insight", insights]);
        } else if (Array.isArray(insights)) {
          insights.forEach((insight, index) => {
            if (typeof insight === "string") {
              insightRows.push([`Insight ${index + 1}`, insight]);
            } else {
              insightRows.push([
                `Insight ${index + 1}`,
                JSON.stringify(insight),
              ]);
            }
          });
        } else if (typeof insights === "object" && insights !== null) {
          Object.entries(insights).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              insightRows.push([
                key.replace(/([A-Z])/g, " $1").toUpperCase(),
                typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value),
              ]);
            }
          });
        }

        if (insightRows.length > 0) {
          doc.autoTable({
            startY: y,
            theme: "grid",

            head: [["CATEGORY", "INFORMATION"]],

            body: insightRows,

            styles: {
              font: "helvetica",
              fontSize: 8,
              cellPadding: 5,
              valign: "top",
            },

            headStyles: {
              fillColor: [17, 17, 19],
              textColor: [255, 255, 255],
            },

            columnStyles: {
              0: {
                cellWidth: 45,
              },
              1: {
                cellWidth: 135,
              },
            },

            margin: {
              left: 15,
              right: 15,
            },
          });
        }
      }

      // --------------------------------------------------
      // 8. FINAL TOTAL
      // --------------------------------------------------

      doc.addPage();

      doc.setFillColor(39, 99, 235);
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);

      doc.text("TRIP COST SUMMARY", 15, 22);

      y = 55;

      doc.autoTable({
        startY: y,

        theme: "plain",

        body: [
          ["Destination", destination],
          ["Duration", `${days.length} Days`],
          ["Travelers", `${travelers}`],
          ["Travel Style", travelStyle],
          ["Budget", `${budget}`],
          ["Estimated Total", `₹${total.toLocaleString("en-IN")}`],
        ],

        styles: {
          font: "helvetica",
          fontSize: 10,
          cellPadding: 7,
        },

        columnStyles: {
          0: {
            fontStyle: "bold",
            textColor: [80, 80, 90],
            cellWidth: 60,
          },
          1: {
            fontStyle: "bold",
            textColor: [20, 20, 25],
            cellWidth: 120,
          },
        },

        margin: {
          left: 15,
          right: 15,
        },
      });

      y = doc.lastAutoTable.finalY + 25;

      doc.setFillColor(239, 246, 255);
      doc.roundedRect(15, y, 180, 35, 5, 5, "F");

      doc.setTextColor(39, 99, 235);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);

      doc.text("WANDER AI GENERATED MANIFEST", 25, y + 12);

      doc.setTextColor(70, 70, 80);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      doc.text(
        "This itinerary was generated using your selected travel preferences.",
        25,
        y + 21,
      );

      doc.text(
        "Verify reservations, timings, prices and local conditions before travel.",
        25,
        y + 28,
      );

      // --------------------------------------------------
      // 9. PAGE NUMBERS
      // --------------------------------------------------

      addPageNumber();

      // --------------------------------------------------
      // 10. SAVE FILE
      // --------------------------------------------------

      const filename = `WanderAI-${cityName.replace(/\s+/g, "-")}-Itinerary.pdf`;

      doc.save(filename);

      toast.success("Trip PDF exported successfully.");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to generate PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isExporting || !tripData}
      className="flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
    >
      {isExporting ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileDown size={16} />
          Export PDF
        </>
      )}
    </button>
  );
}
