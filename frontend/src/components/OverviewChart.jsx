import React, { useMemo } from 'react'
import { ResponsiveLine } from "@nivo/line"
import { useTheme } from "@mui/material"

const OverviewChart = ({ websiteDetails }) => {

  const theme = useTheme()

  function formatSize(sizeInBytes) {
    return (sizeInBytes / 1024).toFixed(2);
  }

  const [errorLogSizeLine] = useMemo(() => {
    if (!websiteDetails) return []

    const historyData = websiteDetails.history
    const errorLogSizeLine  = {
      id: "errorLogSize",
      color: theme.palette.secondary[600],
      data: [],
    }

    historyData.forEach((element) => {
      errorLogSizeLine.data.push({ x: element.timestamp, y: formatSize(element.jsonData.directory_size.error_log_size.file_size) })
    })
  
    return [[errorLogSizeLine]]
  }, [websiteDetails, theme])

  return (
    <ResponsiveLine
      data={errorLogSizeLine}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: theme.palette.secondary[200],
            },
          },
          legend: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          ticks: {
            line: {
              stroke: theme.palette.secondary[200],
              strokeWidth: 1,
            },
            text: {
              fill: theme.palette.secondary[200],
            },
          },
        },
        legends: {
          text: {
            fill: theme.palette.secondary[200],
          },
        },
        tooltip: {
          container: {
            color: theme.palette.primary.main,
          },
        },
      }}
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="linear"
      enableArea={true}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (v) => {
          return v.slice(5, 10)
          
        },
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -90,
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'File size',
        legendOffset: -60,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      enablePoints={false}
      useMesh={true}
      legends={undefined}
      motionConfig="stiff"
    />
  );
}

export default OverviewChart