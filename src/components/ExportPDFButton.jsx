import React, { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export default function ExportPDFButton({ tripData }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (!tripData) {
      toast.error("Trip data is missing.");
      return;
    }

    setIsExporting(true);

    try {
      // Create the document instance
      const doc = new jsPDF();

      // Extract key trip data
      const cityName =
        tripData.destination?.split(",")[0]?.trim() || "Destination";
      const destination = tripData.destination || cityName;
      const days = tripData.itinerary?.days || [];
      const travelers = tripData.input?.numTravelers || 1;
      const travelStyle = tripData.input?.travelStyle || "Standard";
      const budget = tripData.input?.budget || "N/A";

      // Calculate total cost across all activities, guarding against NaN
      const total = days.reduce((acc, day) => {
        const morning = parseFloat(day.morning?.estimatedCost) || 0;
        const afternoon = parseFloat(day.afternoon?.estimatedCost) || 0;
        const evening = parseFloat(day.evening?.estimatedCost) || 0;
        return acc + morning + afternoon + evening;
      }, 0);

      const safeTotal = Number.isFinite(total) ? total : 0;

      // ---- Helper functions ----

      // Add page numbers and brand footer to every page
      const addPageNumber = () => {
        const pageCount = doc.internal.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);

          doc.text(
            `YatraAI • ${cityName}`,
            15,
            doc.internal.pageSize.height - 10,
          );

          doc.text(
            `Page ${i} of ${pageCount}`,
            195,
            doc.internal.pageSize.height - 10,
            { align: "right" },
          );
        }
      };

      // Add a section heading with an underline
      const addSectionTitle = (title, y) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(20, 20, 25);
        doc.text(title, 15, y);

        doc.setDrawColor(220, 220, 220);
        doc.line(15, y + 3, 195, y + 3);

        return y + 12;
      };

      // ---- Brand header ----

      doc.setFillColor(39, 99, 235);
      doc.rect(0, 0, 210, 18, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("YatraAI", 15, 12);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("AI TRIP ITINERARY", 195, 12, { align: "right" });

      // ---- Destination hero ----

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

      // Confirmed badge
      doc.setFillColor(220, 252, 231);
      doc.roundedRect(155, 27, 40, 10, 3, 3, "F");

      doc.setTextColor(22, 101, 52);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("CONFIRMED", 175, 33.5, { align: "center" });

      // ---- Trip summary table ----

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
            `Rs.${safeTotal.toLocaleString("en-IN")}`,
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
        bodyStyles: { fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 35 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
          4: { cellWidth: 40 },
        },
        margin: { left: 15, right: 15 },
      });

      y = (doc.lastAutoTable?.finalY || y) + 15;

      // ---- Interests section ----

      const interests = tripData.input?.interest || [];

      if (interests.length > 0) {
        y = addSectionTitle("TRAVEL INTERESTS", y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 90);
        doc.text(interests.join(" • "), 15, y);

        y += 15;
      }

      // ---- Itinerary section ----

      if (days.length > 0) {
        y = addSectionTitle("ITINERARY", y);

        days.forEach((day, index) => {
          const activities = [
            { period: "Morning", data: day.morning },
            { period: "Afternoon", data: day.afternoon },
            { period: "Evening", data: day.evening },
          ].filter((item) => item.data?.activity);

          if (activities.length === 0) return;

          // Start a new page if close to the bottom
          if (y > 240) {
            doc.addPage();
            y = 25;
          }

          // Day label
          doc.setFillColor(39, 99, 235);
          doc.roundedRect(15, y - 6, 30, 9, 2, 2, "F");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(255, 255, 255);
          doc.text(`DAY ${index + 1}`, 30, y, { align: "center" });

          y += 12;

          // Activity rows
          const tableRows = activities.map(({ period, data }) => [
            period,
            data.activity || "N/A",
            data.location || "N/A",
            data.description || "N/A",
            `Rs.${Number(data.estimatedCost || 0).toLocaleString("en-IN")}`,
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
              0: { cellWidth: 22 },
              1: { cellWidth: 35 },
              2: { cellWidth: 30 },
              3: { cellWidth: 75 },
              4: { cellWidth: 20, halign: "right" },
            },
            margin: { left: 15, right: 15 },
          });

          y = (doc.lastAutoTable?.finalY || y) + 12;
        });
      }

      // ---- Logistics section ----

      if (tripData.logistics) {
        if (y > 230) {
          doc.addPage();
          y = 25;
        }

        y = addSectionTitle("LOGISTICS", y);

        const logistics = tripData.logistics;
        const logisticsRows = [];

        if (logistics.hotel || logistics.accommodation) {
          logisticsRows.push([
            "Accommodation",
            logistics.hotel || logistics.accommodation,
          ]);
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
            margin: { left: 15, right: 15 },
          });

          y = (doc.lastAutoTable?.finalY || y) + 15;
        }
      }

      // ---- AI Insights section ----

      // Prefer aiInsights if present, fall back to insights
      const rawInsights = tripData.aiInsights || tripData.insights;

      if (rawInsights) {
        if (y > 220) {
          doc.addPage();
          y = 25;
        }

        y = addSectionTitle("AI TRAVEL INSIGHTS", y);

        const insightRows = [];

        if (typeof rawInsights === "string") {
          insightRows.push(["Insight", rawInsights]);
        } else if (Array.isArray(rawInsights)) {
          rawInsights.forEach((insight, index) => {
            if (typeof insight === "string") {
              insightRows.push([`Insight ${index + 1}`, insight]);
            } else {
              insightRows.push([
                `Insight ${index + 1}`,
                JSON.stringify(insight),
              ]);
            }
          });
        } else if (typeof rawInsights === "object") {
          Object.entries(rawInsights).forEach(([key, value]) => {
            if (value === null || value === undefined) return;

            // Convert "moneySavingTips" into "MONEY SAVING TIPS"
            const label = key
              .replace(/([A-Z])/g, " $1")
              .trim()
              .toUpperCase();

            let text;

            if (Array.isArray(value)) {
              text = value.join(" • ");
            } else if (typeof value === "object") {
              text = JSON.stringify(value);
            } else {
              text = String(value);
            }

            insightRows.push([label, text]);
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
              0: { cellWidth: 45 },
              1: { cellWidth: 135 },
            },
            margin: { left: 15, right: 15 },
          });
        }
      }

      // ---- Final cost summary page ----

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
          ["Estimated Total", `Rs.${safeTotal.toLocaleString("en-IN")}`],
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
        margin: { left: 15, right: 15 },
      });

      y = (doc.lastAutoTable?.finalY || y) + 25;

      // Footer note box
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(15, y, 180, 35, 5, 5, "F");

      doc.setTextColor(39, 99, 235);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("YATRAAI GENERATED ITINERARY", 25, y + 12);

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

      // ---- Add page numbers ----

      addPageNumber();

      // ---- Save file ----

      const filename = `YatraAI-${cityName.replace(/\s+/g, "-")}-Itinerary.pdf`;

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
          Generating…
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
