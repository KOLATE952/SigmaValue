from django.http import JsonResponse
import pandas as pd
import os
from django.conf import settings

file_path = os.path.join(settings.BASE_DIR, 'analysis', 'data', 'realestate.xlsx')
df = pd.read_excel(file_path, engine="openpyxl")

df.columns = df.columns.str.strip()
df['final location'] = df['final location'].astype(str).str.strip().str.lower()

def realestate_data(request):
    query = request.GET.get("location", "").strip().lower()
    filtered_df = df

    if query:
        areas = [q.strip().lower() for q in query.split(",")]
        mask = filtered_df['final location'].str.lower().isin(areas)
        filtered_df = filtered_df[mask]

    data = filtered_df.to_dict(orient="records")

    avg_price = filtered_df['flat - weighted average rate'].mean() if not filtered_df.empty else 0.0

    if filtered_df.empty:
        summary_text = f"Sorry, we don't have any real estate data for '{query}'."
    else:
        areas_list = sorted(set(filtered_df['final location'].tolist()))
        years_list = sorted(set(filtered_df['year'].tolist()))

        if len(years_list) == 1:
            years_str = f"in {years_list[0]}"
        else:
            years_str = f"from {years_list[0]} to {years_list[-1]}"

        areas_str = ", ".join(areas_list)

        summary_text = (
            f"Real estate in {areas_str} {years_str} had an average price of "
            f"${avg_price:,.2f}. Prices show general trends and can vary depending on the location and flat type."
        )

    return JsonResponse({
        "realestate": data,
        "summary": summary_text
    }, safe=False)
