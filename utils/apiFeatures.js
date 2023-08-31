class ApiFeatures {
  constructor(mongooseQuery , queryString ) {
  this.mongooseQuery = mongooseQuery;
  this.queryString = queryString;
  }

  filter () {
  //filtering 
  const queryStringObj = {...this.queryString}
  const excludesFiels = [ "page" , "limit" , "sort" , "fields"];
   excludesFiels.forEach((field) =>  delete queryStringObj[field]);
   // apply flteration using (gt , gte , lt , lte)
   let queryStr = JSON.stringify(queryStringObj);
   queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g , (match) => `$${match}` );
   this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr))

   return this;

  }

  sort () {
        //sorting

        if(this.queryString.sort)
        {
      
      const  sort =  this.queryString.sort.split(",").join(" ");
        this.mongooseQuery = this.mongooseQuery.sort(sort)
      } else {
        this.mongooseQuery = this.mongooseQuery.sort("-createdAt")
      }
      
    return this;
  }

  limitField () {
    if (this.queryString.fields)
{

 const fields = this.queryString.fields.split(",").join(" ");

this.mongooseQuery =  this.mongooseQuery.select(fields);

  
} else {
  this.mongooseQuery =  this.mongooseQuery.select("-__v");
}
return this;
  }

  search (modelName) {
    //search
if(this.queryString.keyword)
{
  const query = {};
  if (modelName === "ProductModel" )
  {
    query.$or = [
      {title : {$regex : this.queryString.keyword , $options : "i"} },
      {description : {$regex : this.queryString.keyword , $options : "i"} },
    ]
  } else if (modelName === "reviewModel") {
    query.$or = [
      {title : {$regex : this.queryString.keyword , $options : "i"} }
    ]
  } else {
    query.$or = [
      {name : {$regex : this.queryString.keyword , $options : "i"} },
    
    ]
  }

  this.mongooseQuery = this.mongooseQuery.find(query)
}

return this;
  }

  pagination (countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const paginate = {};
    paginate.currentPage = page;
    paginate.limit = limit;
    paginate.numberOfPage = Math.ceil(countDocuments / limit);

    if (endIndex < countDocuments)
    {
      paginate.next = page + 1
    }
    if (skip > 0 )
    {
      paginate.prev = page - 1
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = paginate
    return this;
  }
}

module.exports = ApiFeatures;