import {AgChartsReact} from 'ag-charts-react';

import {aggregateRequest} from "../utils/EsClient";
import {Bucket, EsAggrResponse} from "../types/es";
import React, {useState} from "react";
import {AggrType, Interval} from "../types/aggregate";
import Header from "./Header";

function AggregationPage() {
    let [dateHistogramData, setDateHistogramData] = useState<Bucket[]>([])
    let [byteHistogramData, setByteHistogramData] = useState<Bucket[]>([])
    let [numBins, setNumBins] = useState(10)
    let [aggrType, setAggrType] = useState<AggrType>("BY_BIN")
    let [dateInterval, setDateInterval] = useState<Interval>("quarter")
    let [interval, setInterval] = useState(10000)


    function dateAggregate() {
        let body = aggrType === 'BY_BIN' ? {
            my_custom_aggregation: {
                auto_date_histogram: {
                    field: "updatedTime",
                    format: "yy/MM/dd",
                    buckets: numBins
                }
            }
        } : {
            my_custom_aggregation: {
                date_histogram: {
                    field: "updatedTime",
                    format: "yy/MM/dd",
                    calendar_interval: dateInterval
                }
            }
        }
        const response = aggregateRequest<EsAggrResponse>("restaurant/_search", body);
        response.then(response => {
            setDateHistogramData(response.aggregations.my_custom_aggregation.buckets)
        })
    }

    function sizeAggregate() {
        let body = {
            my_custom_aggregation: {
                histogram: {
                    field: "size",
                    interval: interval
                }
            }
        }
        const response = aggregateRequest<EsAggrResponse>("restaurant/_search", body);
        response.then(response => {
            setByteHistogramData(response.aggregations.my_custom_aggregation.buckets)
        })
    }

    return (
        <>
            <Header/>
            <h2>last modification time histogram</h2>

            <form onSubmit={event => {
                event.preventDefault();
                dateAggregate()
            }} style={{display: 'flex', margin: '10px 0'}}>
                <div style={{display: 'flex', marginRight: '15px'}}>
                    <div>aggregation mode:</div>
                    <input onChange={event => setAggrType(event.target.value as AggrType)} checked={aggrType === "BY_BIN"} name="aggrMode" value="BY_BIN" type={"radio"}/>
                    <label>byNumBins</label>
                    <input onChange={event => setAggrType(event.target.value as AggrType)} checked={aggrType === "BY_INTERVAL"} name="aggrMode" value="BY_INTERVAL" type={"radio"}/>
                    <label>byInterval</label>
                </div>
                {
                    aggrType === 'BY_BIN' ? <>
                        <div>expected number of bins: &nbsp;&nbsp;</div>
                        <input type={"number"} value={numBins} onChange={event => setNumBins(event.target.value as unknown as number)}/>

                    </> : <>
                        <label>Select interval:</label>
                        <select style={{margin: '0 10px'}} onChange={event => setDateInterval(event.target.value as Interval)} value={dateInterval}>
                            <option value="minute">minute</option>
                            <option value="hour">hour</option>
                            <option value="day">day</option>
                            <option value="week">week</option>
                            <option value="month">month</option>
                            <option value="quarter">quarter</option>
                            <option value="year">year</option>
                        </select>
                    </>
                }
                <button type='submit'>aggregate</button>
            </form>

            <AgChartsReact options={{
                title: {
                    text: "last update time",
                },
                data: dateHistogramData,
                series: [
                    {
                        type: 'column',
                        xKey: 'key_as_string',
                        xName: 'date',
                        yKey: 'doc_count',
                        yName: 'count'
                    },
                ],

            }}/>

            <h2>page size histogram</h2>

            <form onSubmit={event => {
                event.preventDefault();
                sizeAggregate()
            }} style={{display: 'flex', margin: '10px 0'}}>
                <div>bin interval: &nbsp;&nbsp;</div>
                <input type={"number"} value={interval} onChange={event => setInterval(event.target.value as unknown as number)}/>
                <button type='submit'>aggregate</button>
            </form>

            <AgChartsReact options={{
                title: {
                    text: "size of page (byte)",
                },
                data: byteHistogramData,
                series: [
                    {
                        type: 'column',
                        xKey: 'key',
                        xName: 'byte',
                        yKey: 'doc_count',
                        yName: 'count'
                    },
                ],

            }}/>
        </>
    )
}

export default AggregationPage;
