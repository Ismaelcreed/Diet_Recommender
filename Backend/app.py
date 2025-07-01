from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender.recommender import recommend_diet

app = Flask(__name__)
CORS(app)

@app.route("/api/recommend", methods=["POST"])
def recommend():
    try:
        data = request.get_json()
        result = recommend_diet(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
     app.run(debug=True, port=5500)
