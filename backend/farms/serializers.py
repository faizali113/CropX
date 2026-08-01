from rest_framework import serializers
from .models import Farm, Crop, MarketListing, Order, DiseaseRecord, MarketPrice, Notification


class FarmSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    owner_email = serializers.CharField(source='owner.email', read_only=True)
    crops_count = serializers.SerializerMethodField()

    class Meta:
        model = Farm
        fields = '__all__'
        read_only_fields = ('owner', 'farm_code', 'created_at', 'updated_at')

    def get_crops_count(self, obj):
        return obj.crops.filter(is_active=True).count()

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class CropSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source='farm.name', read_only=True)

    class Meta:
        model = Crop
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class MarketListingSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.name', read_only=True)

    class Meta:
        model = MarketListing
        fields = '__all__'
        read_only_fields = ('farmer', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['farmer'] = self.context['request'].user
        return super().create(validated_data)


class OrderSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.name', read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('order_id', 'farmer', 'total_price', 'created_at', 'updated_at')

    def create(self, validated_data):
        listing = validated_data.get('listing')
        validated_data['farmer'] = listing.farmer if listing else self.context['request'].user
        qty = validated_data.get('quantity_kg', 0)
        price = validated_data.get('price_per_kg', 0)
        validated_data['total_price'] = qty * price
        return super().create(validated_data)


class DiseaseRecordSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.name', read_only=True)

    class Meta:
        model = DiseaseRecord
        fields = '__all__'
        read_only_fields = ('farmer', 'created_at')

    def create(self, validated_data):
        validated_data['farmer'] = self.context['request'].user
        instance = super().create(validated_data)
        # Simulate ML response for demo
        instance.disease_name = 'Leaf Blight (Demo)'
        instance.confidence = 87.5
        instance.severity = 'MEDIUM'
        instance.symptoms = 'Yellow-brown spots on leaves, wilting edges'
        instance.causes = 'Fungal infection (Alternaria alternata), high humidity'
        instance.prevention = 'Crop rotation, remove infected leaves, ensure proper drainage'
        instance.organic_treatment = 'Neem oil spray (5ml/L), Trichoderma viride application'
        instance.chemical_treatment = 'Mancozeb 75% WP @ 2g/L or Carbendazim 50% WP @ 1g/L'
        instance.scan_status = 'COMPLETED'
        instance.save()
        return instance


class MarketPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketPrice
        fields = '__all__'
        read_only_fields = ('recorded_date', 'created_at')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
