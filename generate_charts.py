import os
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Create directory if it doesn't exist
output_dir = "src/assets/charts"
os.makedirs(output_dir, exist_ok=True)

print("Generating 1. Cost of Fragmentation...")
# 1. Cost of Fragmentation
categories = ['Without MCC', 'With MCC']
costs = [2145, 13847]
fig1 = go.Figure()
fig1.add_bar(
    x=categories,
    y=costs,
    marker_color=['#4C78A8', '#E45756'],
    text=[f"${c:,}" for c in costs],
    textposition='outside'
)
fig1.update_layout(
    title="Cost of Fragmentation",
    yaxis_title="Cost per Patient (USD)",
    template="plotly_white",
    font=dict(family="Arial", size=16),
    title_x=0.5,
    margin=dict(l=40, r=40, t=60, b=40)
)
fig1.write_image(os.path.join(output_dir, "cost_fragmentation.svg"), format="svg", width=900, height=600, scale=2)

print("Generating 2. Scale vs Time...")
# 2. Scale vs Time
fig2 = go.Figure()
fig2.add_bar(
    x=['United States'],
    y=[40],
    name='Years',
    marker_color='#2F4B7C'
)
fig2.add_scatter(
    x=['India'],
    y=[800],
    mode='markers+text',
    name='ABHA IDs (Millions)',
    marker=dict(size=14, color='#00A6A6'),
    text=['800M+'],
    textposition='top center',
    yaxis='y2'
)
fig2.update_layout(
    title="Scale vs Time Comparison",
    template="plotly_white",
    font=dict(family="Arial", size=16),
    yaxis=dict(title="Years", range=[0, 50]),
    yaxis2=dict(
        title="Population Scale (Millions)",
        overlaying='y',
        side='right',
        range=[0, 900]
    ),
    title_x=0.5
)
fig2.write_image(os.path.join(output_dir, "scale_vs_time.svg"), format="svg", width=900, height=600, scale=2)

print("Generating 3. Economic Arbitrage...")
# 3. Economic Arbitrage
fig3 = go.Figure(go.Waterfall(
    x=["US Fragmentation", "India Efficiency", "Net Impact"],
    y=[784, -40, 0],
    measure=["relative", "relative", "total"],
    text=["+784%", "-40%", "Net"],
    textposition="outside",
    increasing=dict(marker=dict(color="#D62728")),
    decreasing=dict(marker=dict(color="#2CA02C")),
    totals=dict(marker=dict(color="#4C78A8"))
))
fig3.update_layout(
    title="Economic Arbitrage in Healthcare Systems",
    yaxis_title="Impact (%)",
    template="plotly_white",
    font=dict(family="Arial", size=16),
    title_x=0.5
)
fig3.write_image(os.path.join(output_dir, "economic_arbitrage.svg"), format="svg", width=900, height=600, scale=2)

print("Generating 4. Composite Infographic...")
# 4. Composite Infographic
fig4 = make_subplots(
    rows=2, cols=2,
    subplot_titles=(
        "Cost of Fragmentation",
        "Scale vs Time",
        "Economic Arbitrage",
        "System Narrative"
    )
)

fig4.add_trace(
    go.Bar(
        x=['Without MCC', 'With MCC'],
        y=[2145, 13847],
        marker_color=['#4C78A8', '#E45756'],
        text=["$2,145", "$13,847"],
        textposition='outside',
        showlegend=False
    ),
    row=1, col=1
)

fig4.add_trace(
    go.Bar(
        x=['US'],
        y=[40],
        marker_color='#2F4B7C',
        showlegend=False
    ),
    row=1, col=2
)
fig4.add_trace(
    go.Scatter(
        x=['India'],
        y=[800],
        mode='markers+text',
        marker=dict(size=12, color='#00A6A6'),
        text=['800M+'],
        textposition='top center',
        yaxis='y2',
        showlegend=False
    ),
    row=1, col=2
)

fig4.add_trace(
    go.Waterfall(
        x=["US Penalty", "India Gain", "Net"],
        y=[784, -40, 0],
        measure=["relative", "relative", "total"],
        increasing=dict(marker=dict(color="#D62728")),
        decreasing=dict(marker=dict(color="#2CA02C")),
        totals=dict(marker=dict(color="#4C78A8")),
        showlegend=False
    ),
    row=2, col=1
)

fig4.add_trace(
    go.Scatter(
        x=[0],
        y=[0],
        text=[
            "<b>Key Insight</b><br><br>"
            "US: Fragmented legacy systems → high cost & inefficiency<br><br>"
            "India: Open standards (ABDM) → scalable, interoperable infrastructure<br><br>"
            "<b>Result:</b> Lower cost, higher efficiency, population-scale intelligence"
        ],
        mode="text",
        showlegend=False
    ),
    row=2, col=2
)

fig4.update_layout(
    height=900,
    width=1200,
    title_text="Healthcare Data Infrastructure: US vs India (ABDM)",
    template="plotly_white",
    font=dict(family="Arial", size=14),
    title_x=0.5,
    margin=dict(t=80, l=40, r=40, b=40)
)
fig4.update_xaxes(showgrid=False)
fig4.update_yaxes(showgrid=True, gridcolor='lightgrey')
fig4.write_image(os.path.join(output_dir, "composite_infographic.svg"), format="svg", scale=3)

print("All SVGs successfully generated in src/assets/charts/")
